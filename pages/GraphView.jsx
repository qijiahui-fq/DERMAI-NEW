/** @jsx React.createElement */
// 🚀 皮肤生物网络图谱组件 - 适配免编译环境

// 1. 对接全局变量 (确保 D3 和 React 正常接入)
const { useEffect, useRef, useState } = React;
const { Loader2, Info } = LucideIcons;
const d3 = window.d3; // 🛠️ 关键：强制从 window 获取 d3 实例

const COLORS = {
  'disease': '#ef4444', 'gene': '#3b82f6', 'drug': '#10b981',
  'pathway': '#f59e0b', 'protein': '#8b5cf6', 'default': '#94a3b8'
};

const LABEL_MAP = {
  'disease': '皮肤疾病', 'gene': '关键基因', 'drug': '皮科药物',
  'pathway': '皮肤通路', 'protein': '表皮蛋白',
};

const GraphView = ({ data, loading = false }) => {
  const svgRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    if (loading || !data?.nodes?.length) return;
    if (!svgRef.current || !d3) {
      console.warn("D3 库尚未加载或 SVG 引用为空");
      return;
    }

    try {
      const width = 800; const height = 600;
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      const g = svg.append("g");

      const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => g.attr("transform", event.transform));

      svg.call(zoom);

      // 🛠️ 浅拷贝数据，防止 D3 修改原始 props 导致 React 报错
      const nodes = data.nodes.map(d => ({ ...d }));
      const links = data.links.map(d => ({ ...d }));

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150).strength(0.8))
        .force("charge", d3.forceManyBody().strength(-600))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(80));

      const link = g.append("g")
        .attr("stroke", "#cbd5e1").attr("stroke-opacity", 0.6)
        .selectAll("line").data(links).join("line").attr("stroke-width", 2);

      const node = g.append("g")
        .selectAll("g").data(nodes).join("g")
        .call(d3.drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
        );

      node.append("circle").attr("r", 16)
        .attr("fill", d => COLORS[String(d.type || '').toLowerCase()] || COLORS['default'])
        .attr("stroke", "#fff").attr("stroke-width", 3);

      node.append("text").text(d => d.name).attr("x", 18).attr("y", 4)
        .style("font-size", "11px").style("font-weight", "600").style("fill", "#334155").style("pointer-events", "none");

      simulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
      });

      return () => { simulation.stop(); };
    } catch (err) {
      console.error("D3 渲染错误:", err);
      setError(`渲染出错: ${err.message}`);
    }
  }, [data, loading]);

  if (loading) return (
    <div className="w-full h-[600px] border border-slate-200 rounded-[2rem] bg-white flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">正在重构皮肤生物网络...</p>
    </div>
  );

  if (error) return (
    <div className="w-full h-[600px] border border-red-200 rounded-[2rem] bg-red-50 flex flex-col items-center justify-center p-6 text-center">
      <Info className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-red-700 font-bold">{error}</p>
    </div>
  );

  return (
    <div className="w-full h-[600px] border border-slate-200 rounded-[2rem] overflow-hidden bg-white relative">
      <svg ref={svgRef} className="w-full h-full" viewBox="0 0 800 600" />
      <div className="absolute top-6 right-6 flex flex-col gap-3 p-5 bg-white/90 backdrop-blur shadow-xl border border-slate-100 rounded-3xl">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">实体图例</h4>
        {Object.entries(LABEL_MAP).map(([key, label]) => (
          <div key={key} className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[key] }} />
            <span className="text-xs font-bold text-slate-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphView;
