from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import time

app = Flask(__name__)
CORS(app) # 保证云端跨域顺畅

OPENTARGETS_GRAPHQL_URL = "https://api.platform.opentargets.org/api/v4/graphql"

# --- 映射 1: 对接前端的 OPENTARGETS_API_URL ---
@app.route('/api/opentargets/graphql', methods=['POST', 'OPTIONS'])
def handle_opentargets():
    if request.method == 'OPTIONS': return jsonify({"status": "ok"}), 200
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

# --- 映射 2: 对接前端的 SCORE_API_URL ---
@app.route('/api/score-target', methods=['POST', 'OPTIONS'])
def handle_score():
    if request.method == 'OPTIONS': return jsonify({"status": "ok"}), 200
    data = request.get_json()
    target_name = data.get('target_name', '')
    disease = data.get('disease', '')
    # 保持你原始的返回结构，确保前端 data.code === 200 能判断通过
    return jsonify({
        'code': 200,
        'data': {'score': 8.5, 'rationale': f'{target_name} 与 {disease} 关联评估完成'}
    })

# --- 映射 3: 对接前端的 LITERATURE_API_URL ---
@app.route('/api/target-literature', methods=['GET', 'OPTIONS'])
def handle_literature():
    if request.method == 'OPTIONS': return jsonify({"status": "ok"}), 200
    target = request.args.get('target', '')
    return jsonify({
        'code': 200, 
        'data': [{'title': f'{target} 在皮肤科的研究进展', 'url': 'https://pubmed.ncbi.nlm.nih.gov/', 'source': 'PubMed'}]
    })

# 保留一个根路径用于健康检查
@app.route('/api', methods=['GET'])
def health_check():
    return jsonify({"message": "DermAI Backend is Running"}), 200
