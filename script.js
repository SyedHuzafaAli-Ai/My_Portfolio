// ---- particle flow animation along the pipeline ----
(function(){
  const segments = [
    {el:'p1', from:[90,90], to:[135,90]},
    {el:'p2', from:[245,90], to:[280,90]},
    {el:'p3', from:[365,90], to:[390,90]},
    {el:'p4', from:[505,90], to:[540,90]}
  ];
  const groups = segments.map(s => ({...s, node: document.getElementById(s.el)}));
  let t0 = performance.now();
  function loop(now){
    const elapsed = (now - t0) / 1000;
    groups.forEach((g, i) => {
      const dur = 1.3;
      const delay = i * 0.42;
      let p = ((elapsed - delay) % (dur + 0.6)) / dur;
      const circle = g.node.querySelector('circle');
      if(p < 0 || p > 1){ circle.setAttribute('opacity','0'); }
      else{
        circle.setAttribute('opacity','1');
        const x = g.from[0] + (g.to[0]-g.from[0]) * p;
        const y = g.from[1] + (g.to[1]-g.from[1]) * p;
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
      }
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// ---- mini retrieval demo: query -> retrieve -> generate ----
(function(){
  const KB = [
    {tags:['hybrid','search','retrieval','bm25','vector'], text:"Fuses Pinecone vector embeddings with BM25 keyword retrieval using Reciprocal Rank Fusion, improving relevance over single-method search.", ans:"He builds hybrid retrieval: dense vector search fused with BM25 keyword search via Reciprocal Rank Fusion."},
    {tags:['rerank','cross-encoder','ranking','precision'], text:"Integrates a cross-encoder re-ranker to filter and prioritize top-k results before they reach the LLM.", ans:"He re-ranks retrieved chunks with a cross-encoder to improve response precision before generation."},
    {tags:['compression','hallucination','context','token'], text:"Applies contextual compression so only the most relevant context segments reach the generation step, cutting hallucinations and token overhead.", ans:"He uses contextual compression to reduce hallucinations and token overhead in the generation step."},
    {tags:['vector','database','pinecone','faiss','chroma'], text:"Comfortable across Pinecone, FAISS, and Chroma for building and querying vector indexes.", ans:"His vector database experience spans Pinecone, FAISS, and Chroma."},
    {tags:['fastapi','backend','api','streamlit','docker'], text:"Ships production-style backends with FastAPI for async query handling, Streamlit for interactive frontends, and Docker for deployment.", ans:"He ships backends with FastAPI (async), Streamlit for UIs, and Docker for deployment."},
    {tags:['final','year','project','nocodenexus','etl'], text:"Built NocodeNexus, a full-stack no-code ETL platform letting non-technical users clean and validate data, 30% faster after vectorizing operations.", ans:"His final year project, NocodeNexus, is a no-code ETL platform — 30% faster after replacing loops with vectorized NumPy/Pandas."},
    {tags:['certification','certificate','ibm','coursera'], text:"Holds four IBM certifications via Coursera: Python for Data Science AI & Development, Machine Learning with Python, Data Visualization with Python, and Python Programming.", ans:"He holds 4 IBM/Coursera certifications spanning Python, ML, and data visualization."},
    {tags:['education','university','uet','cgpa','degree'], text:"Final-year BS Computer Science student at UET Lahore, expected 2026, CGPA 3.0/4.0.", ans:"He's a final-year BS Computer Science student at UET Lahore, graduating 2026."},
    {tags:['claude','gpt','llm','openai','prompt'], text:"Works directly with the OpenAI GPT-4o and Claude APIs, including prompt engineering for retrieval-grounded generation.", ans:"He works with both the GPT-4o and Claude APIs, with hands-on prompt engineering for grounded generation."},
    {tags:['agent','agentic','react','tool','autonomous'], text:"Built an Agentic RAG Research Assistant: a ReAct-style agent that routes queries to tools and self-corrects by reformulating and retrying retrieval when confidence is low.", ans:"His agent project implements the ReAct pattern with tool routing and self-correcting retrieval — retries with a reformulated query when confidence is low."}
  ];

  const input = document.getElementById('queryInput');
  const btn = document.getElementById('askBtn');
  const chunksEl = document.getElementById('chunks');
  const answerEl = document.getElementById('answer');

  function retrieve(q){
    const query = q.toLowerCase();
    const scored = KB.map(item => {
      let score = 0;
      item.tags.forEach(tag => { if(query.includes(tag)) score += 1; });
      // loose partial match fallback
      if(score === 0){
        item.tags.forEach(tag => { if(tag.includes(query.slice(0,4)) && query.length > 2) score += 0.4; });
      }
      return {...item, score};
    }).filter(i => i.score > 0).sort((a,b)=>b.score-a.score).slice(0,3);
    return scored;
  }

  function run(){
    const q = input.value.trim();
    chunksEl.innerHTML = '';
    answerEl.style.display = 'none';
    if(!q) return;
    const results = retrieve(q);
    if(results.length === 0){
      chunksEl.innerHTML = '<div class="chunk">No matching chunks — try "hybrid search", "FastAPI", or "certifications".</div>';
      return;
    }
    results.forEach((r, i) => {
      const div = document.createElement('div');
      div.className = 'chunk';
      div.style.animationDelay = (i * 0.08) + 's';
      const sim = (0.94 - i * 0.09).toFixed(2);
      div.innerHTML = '<span class="score">' + sim + '</span><span>' + r.text + '</span>';
      chunksEl.appendChild(div);
    });
    answerEl.innerHTML = '<b>Generated:</b> ' + results[0].ans;
    answerEl.style.display = 'block';
  }

  btn.addEventListener('click', run);
  input.addEventListener('keydown', e => { if(e.key === 'Enter') run(); });
})();
