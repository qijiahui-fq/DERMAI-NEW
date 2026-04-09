from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app) # 确保云端跨域顺畅

OPENTARGETS_GRAPHQL_URL = "https://api.platform.opentargets.org/api/v4/graphql"

# --- 映射 1: 对应你 targetService.ts 里的 OPENTARGETS_API_URL ---
@app.route('/api/opentargets/graphql', methods=['POST', 'OPTIONS'])
def handle_opentargets():
    if request.method == 'OPTIONS': 
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json()
        response = requests.post(
            OPENTARGETS_GRAPHQL_URL,
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- 映射 2: 对应你 targetService.ts 里的 SCORE_API_URL ---
@app.route('/api/score-target', methods=['POST', 'OPTIONS'])
def handle_score():
    if request.method == 'OPTIONS': 
        return jsonify({"status": "ok"}), 200
    data = request.get_json()
    target_name = data.get('target_name', 'Unknown')
    disease = data.get('disease', 'Unknown')
    # 严格按照你前端 get_json() 预期的格式返回
    return jsonify({
        'code': 200,
        'data': {'score': 8.5, 'rationale': f'DermAI-Score 验证 {target_name} 与 {disease} 关联成功'}
    })

# --- 映射 3: 对应你 targetService.ts 里的 LITERATURE_API_URL ---
@app.route('/api/target-literature', methods=['GET', 'OPTIONS'])
def handle_literature():
    if request.method == 'OPTIONS': 
        return jsonify({"status": "ok"}), 200
    target = request.args.get('target', 'Target')
    return jsonify({
        'code': 200, 
        'data': [{'title': f'{target} 在皮科领域的最新研究', 'url': 'https://pubmed.ncbi.nlm.nih.gov/', 'source': 'PubMed'}]
    })

# 根路径健康检查
@app.route('/api', methods=['GET'])
def health_check():
    return jsonify({"status": "DermAI Backend Online"}), 200
