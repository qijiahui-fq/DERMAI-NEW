from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import time

# ========== 【关键】删除了本地代理配置 (Vercel 服务器自带网络，不需要代理) ==========

app = Flask(__name__)

# 允许跨域
CORS(app)

# OpenTargets 官方 API 地址
OPENTARGETS_GRAPHQL_URL = "https://api.platform.opentargets.org/api/v4/graphql"

# Vercel 会自动将 /api 请求映射到这里
@app.route('/api', methods=['POST', 'GET', 'OPTIONS'])
def handle_api():
    # 处理跨域预检
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    # 处理前端传来的请求
    data = request.get_json() if request.is_json else None
    
    # 根据前端传来的 action 或路径判断该执行哪个逻辑
    # 逻辑 1: OpenTargets 转发
    if data and 'query' in data:
        try:
            response = requests.post(
                OPENTARGETS_GRAPHQL_URL,
                json=data,
                headers={"Content-Type": "application/json"},
                timeout=30 
            )
            return jsonify(response.json()), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # 逻辑 2: 打分系统 (对应原来的 score-target)
    if data and 'target_name' in data:
        target_name = data.get('target_name', '')
        disease = data.get('disease', '')
        score = 8.5  # 简化的演示评分逻辑
        return jsonify({
            'code': 200,
            'data': {'score': score, 'rationale': f'{target_name} 与 {disease} 关联评估完成'}
        })

    # 逻辑 3: 文献接口 (对应原来的 target-literature)
    target = request.args.get('target', '')
    if target:
        return jsonify({
            'code': 200, 
            'data': [{'title': f'{target} 在皮肤科的研究进展', 'url': 'https://pubmed.ncbi.nlm.nih.gov/', 'source': 'PubMed'}]
        })

    return jsonify({"message": "DermAI Backend is Running"}), 200

# ========== 【关键】删除了 app.run()，Vercel 不需要这个启动命令 ==========
