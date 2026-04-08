from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
import time

# ========== 代理配置 (请确保你的代理软件 7890 端口已开启) ==========
os.environ['HTTP_PROXY'] = 'http://127.0.0.1:7890'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:7890'
os.environ['NO_PROXY'] = 'localhost,127.0.0.1'

app = Flask(__name__)

# 允许跨域：解决前端 localhost 访问 127.0.0.1 的拦截问题
CORS(app, resources={r"/*": {"origins": "*"}})

# OpenTargets 官方 API 地址
OPENTARGETS_GRAPHQL_URL = "https://api.platform.opentargets.org/api/v4/graphql"

# 在 server.py 中，将路由改为这样（增加 strict_slashes=False）
@app.route('/api/opentargets/graphql', methods=['POST', 'OPTIONS'], strict_slashes=False)
def opentargets_proxy():
    # ... 原有代码 ...
    # 处理跨域预检请求
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    start_time = time.time()
    try:
        # 1. 获取前端发来的 JSON 数据
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body provided"}), 400

        print(f"--- 收到请求: {data.get('query')[:50]}... ---")

        # 2. 转发请求到 OpenTargets
        # 增加 timeout 到 60s，应对生物信息大数据的慢响应
        response = requests.post(
            OPENTARGETS_GRAPHQL_URL,
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=60 
        )

        duration = round(time.time() - start_time, 2)
        print(f"OpenTargets 返回状态: {response.status_code} | 耗时: {duration}s")

        # 3. 将结果原样返回给前端
        # 即使是 400/500，也将错误详情传给前端方便调试
        return jsonify(response.json()), response.status_code

    except requests.exceptions.Timeout:
        print("错误: 请求 OpenTargets 超时 (30s)")
        return jsonify({"error": "Gateway Timeout: OpenTargets standard response exceeded 30s"}), 504
    except Exception as e:
        print(f"后端内部错误: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ========== 你原有的其他路由 (保持不变) ==========

@app.route('/api/score-target', methods=['POST'])
def score_target():
    try:
        data = request.get_json()
        target_name = data.get('target_name', '')
        disease = data.get('disease', '')
        open_targets_score = data.get('open_targets_score', 0.5)
        score = min(10, max(1, open_targets_score * 10))
        return jsonify({
            'code': 200,
            'data': {'score': score, 'rationale': f'{target_name} 与 {disease} 关联评分成功'}
        })
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e)}), 500

@app.route('/api/target-literature', methods=['GET'])
def target_literature():
    target = request.args.get('target', '')
    return jsonify({
        'code': 200, 
        'data': [{'title': f'{target} 相关研究', 'url': '#', 'source': 'PubMed'}]
    })

if __name__ == '__main__':
    # 使用 0.0.0.0 确保局域网/本地均可访问
    print("🚀 皮科药研平台后端已启动: http://127.0.0.1:3000")
    app.run(host='0.0.0.0', port=3000, debug=True)
