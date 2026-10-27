/* Dữ liệu câu hỏi được chèn khi đóng gói; chạy hoàn toàn ngoại tuyến. */
const QUESTIONS = [
  {
    "scene": "wall",
    "title": "Đẩy tường thật mạnh",
    "prompt": "Bạn đẩy vào một bức tường nhưng tường vẫn đứng yên. Công của lực đẩy tác dụng lên tường là…",
    "answer": 2,
    "why": "Tường không dịch chuyển (s = 0), nên công của lực đẩy lên tường bằng 0. Cơ thể vẫn có thể tiêu hao năng lượng."
  },
  {
    "scene": "lift",
    "title": "Nâng cặp lên bàn",
    "prompt": "Bạn nâng chiếc cặp từ dưới sàn lên bàn. Trong lúc cặp đi lên, công của lực nâng tác dụng lên cặp là…",
    "answer": 0,
    "why": "Lực nâng hướng lên, cùng hướng dịch chuyển của cặp nên công của lực nâng là công dương."
  },
  {
    "scene": "hold",
    "title": "Giữ sách có mỏi không?",
    "prompt": "Bạn giữ chồng sách đứng yên trên tay. Công của lực đỡ do tay tác dụng lên sách là…",
    "answer": 2,
    "why": "Sách đứng yên nên độ dịch chuyển bằng 0. Lực đỡ không thực hiện công lên sách, dù bạn vẫn có thể thấy mỏi."
  },
  {
    "scene": "book",
    "title": "Đẩy sách trên bàn",
    "prompt": "Tay đẩy cuốn sách trượt sang phải. Lực của tay hướng sang phải. Công của lực đẩy lên sách là…",
    "answer": 0,
    "why": "Lực của tay cùng hướng dịch chuyển của sách nên công của lực đẩy là công dương. Ở đây chỉ xét lực của tay."
  },
  {
    "scene": "tray",
    "title": "Mang khay đi ngang",
    "prompt": "Bạn mang khay chuyển động ngang ở độ cao không đổi. Chỉ xét lực đỡ thẳng đứng của tay lên khay. Công của lực này là…",
    "answer": 2,
    "why": "Lực đỡ thẳng đứng vuông góc với hướng dịch chuyển ngang: α = 90°, nên công của lực đỡ bằng 0."
  },
  {
    "scene": "friction",
    "title": "Ma sát đang làm gì?",
    "prompt": "Cuốn sách trượt sang phải trên bàn. Lực ma sát của bàn lên sách hướng sang trái. Công của lực ma sát là…",
    "answer": 1,
    "why": "Lực ma sát ngược hướng dịch chuyển nên thực hiện công âm (công cản). Một phần cơ năng chuyển hóa thành nội năng."
  },
  {
    "scene": "fall",
    "title": "Quả bóng đang rơi",
    "prompt": "Một quả bóng rơi thẳng xuống. Chỉ xét trọng lực tác dụng lên bóng. Công của trọng lực là…",
    "answer": 0,
    "why": "Trọng lực hướng xuống, cùng hướng dịch chuyển của bóng trong quá trình rơi nên trọng lực thực hiện công dương."
  }
];
const CHOICES=['Công dương','Công âm','Công bằng 0'];
const app=document.getElementById('app');
const KEY='vatli10-bai23-v1';
let answers=Array(7).fill(null),current=0,screen='intro',revealed=false;
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&Array.isArray(saved.answers)&&saved.answers.length===7&&saved.answers.every(a=>a===null||[0,1,2].includes(a))){answers=saved.answers;current=Math.max(0,Math.min(6,Number(saved.current)||0));screen=['intro','question','summary'].includes(saved.screen)?saved.screen:'intro';revealed=Boolean(saved.revealed);if(screen==='summary'&&answers.includes(null)){screen='question';current=answers.indexOf(null)}}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify({answers,current,screen,revealed}))}catch(e){}}
function focus(){app.focus();window.scrollTo(0,0)}
function intro(){screen='intro';app.innerHTML=`<section class="intro"><div><p class="tag">Khởi động bài học · Vật lí 10</p><h1>Tốn sức có chắc<br>là có công?</h1><p>Đẩy tường, nâng cặp, giữ sách… Cùng làm nhà vật lí và dự đoán điều đang xảy ra!</p><div class="rules"><strong>7 tình huống · Khoảng 5 phút</strong><br>Chọn một đáp án cho mỗi câu. Chưa cần biết công thức. Đáp án được giữ kín đến cuối trò chơi.</div><div class="actions"><button class="primary" id="start">${answers.some(a=>a!==null)?'Tiếp tục dự đoán':'Bắt đầu chơi'}</button><button class="quiet" id="rules">Cách chơi cùng cả lớp</button></div><div id="instructions" hidden class="rules">Giáo viên chiếu từng câu. Cả lớp giơ A, B hoặc C; giáo viên chọn phương án của lớp rồi ghi dự đoán. Sau 7 câu, có thể thảo luận trước khi mở đáp án. Không giới hạn thời gian và có thể sửa lựa chọn trước khi mở đáp án.</div></div><div class="chalk"><p class="formula">Có lực ≠ luôn có công</p><img src="assets/wall.svg" alt="Một người đẩy tường nhưng tường không dịch chuyển"><p class="caption">Thử đoán trước. Khám phá sau.</p></div></section>`;document.getElementById('start').onclick=()=>{if(answers.every(a=>a!==null))summary();else{current=answers.indexOf(null);question()}focus()};document.getElementById('rules').onclick=()=>{const el=document.getElementById('instructions');el.hidden=!el.hidden};save()}
function question(){screen='question';save();const q=QUESTIONS[current];app.innerHTML=`<div class="meta"><span>Câu ${current+1} / 7</span><span>Dự đoán trước khi học</span></div><div class="progress" role="progressbar" aria-label="Tiến độ câu hỏi" aria-valuemin="0" aria-valuemax="7" aria-valuenow="${current}"><span style="width:${current/7*100}%"></span></div><section class="question"><figure class="scene"><img src="assets/${q.scene}.svg" alt="Minh họa: ${q.title}"><figcaption>Chỉ xét công của lực được nêu trong câu hỏi.</figcaption></figure><div><h1>${q.title}</h1><p class="prompt">${q.prompt}</p><div class="options" role="group" aria-label="Chọn đáp án">${CHOICES.map((t,i)=>`<button class="option" data-choice="${i}" aria-pressed="${answers[current]===i}"><span class="letter">${'ABC'[i]}</span><span>${t}</span></button>`).join('')}</div><p class="hint" id="selection" aria-live="polite">${answers[current]===null?'Chọn A, B hoặc C. Mỗi câu đúng được 1 điểm.':'Đã chọn '+ 'ABC'[answers[current]]+'. Bạn vẫn có thể đổi dự đoán.'}</p><div class="nav"><button id="back" class="quiet">${current?'Câu trước':'Trang đầu'}</button><button id="next" class="primary" ${answers[current]===null?'disabled':''}>${current===6?'Hoàn tất dự đoán':'Ghi dự đoán · Câu tiếp'}</button></div></div></section>`;
app.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{answers[current]=Number(b.dataset.choice);save();app.querySelectorAll('[data-choice]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.choice)===answers[current])));document.getElementById('selection').textContent='Đã chọn '+ 'ABC'[answers[current]]+'. Bạn vẫn có thể đổi dự đoán.';document.getElementById('next').disabled=false});
document.getElementById('next').onclick=()=>{if(answers[current]===null)return;if(current===6)summary();else{current++;question()}focus()};document.getElementById('back').onclick=()=>{if(current){current--;question()}else intro();focus()}}
function summary(){screen='summary';save();let score=answers.filter((a,i)=>a===QUESTIONS[i].answer).length;app.innerHTML=`<section class="summary"><p class="tag">Đã ghi nhận 7 / 7 dự đoán</p><h1>${revealed?'Cùng giải mã công cơ học':'Bạn đã có dự đoán của mình!'}</h1>${revealed?`<div class="result" role="status"><strong>${score} / 7 điểm</strong><p>${score===7?'Tuyệt vời! Bạn đã phân biệt đúng công của từng lực.':'Mỗi dự đoán là một bước khám phá. Cùng xem vì sao nhé!'}</p></div>`:'<p>Hãy trao đổi trước khi xem kết quả: <strong>Việc nào khiến ta mệt nhưng lực tác dụng lên vật lại không thực hiện công?</strong></p>'}<div class="actions">${revealed?'':'<button id="reveal" class="gold">Mở đáp án & tính điểm</button><button id="edit" class="quiet">Sửa dự đoán</button>'}<button id="restart" class="${revealed?'primary':'quiet'}">Chơi lại</button></div><div class="answer-list">${QUESTIONS.map((q,i)=>`<article class="answer-row ${revealed?(answers[i]===q.answer?'correct':'wrong'):''}"><strong>${i+1}. ${q.title}</strong><span>Bạn chọn: ${'ABC'[answers[i]]}. ${CHOICES[answers[i]]}</span>${revealed?`<p><b>${answers[i]===q.answer?'Đúng':'Chưa đúng'} · Đáp án ${'ABC'[q.answer]}: ${CHOICES[q.answer]}</b></p><p>${q.why}</p>`:''}</article>`).join('')}</div>${revealed?'<div class="discussion"><h2>Tốn sức và công cơ học khác nhau thế nào?</h2><p>Cơ thể vẫn có thể tiêu hao năng lượng khi giữ vật đứng yên. Nhưng công của lực đỡ lên vật bằng 0 vì vật không dịch chuyển.</p><p><strong>Ghi nhớ:</strong> Với lực không đổi và chuyển động thẳng, A = F · s · cos α. Công phụ thuộc vào lực, độ dịch chuyển và góc giữa chúng.</p></div>':''}<div class="reset-panel" id="reset-panel" hidden><p>Bắt đầu lượt mới sẽ xóa toàn bộ dự đoán và điểm của lượt này.</p><button id="confirm-reset" class="primary">Xóa lượt này & chơi lại</button> <button id="cancel-reset" class="quiet">Giữ lượt hiện tại</button></div></section>`;if(!revealed){document.getElementById('reveal').onclick=()=>{revealed=true;summary();focus()};document.getElementById('edit').onclick=()=>{current=0;question();focus()}}document.getElementById('restart').onclick=()=>{document.getElementById('reset-panel').hidden=false;document.getElementById('confirm-reset').focus()};document.getElementById('cancel-reset').onclick=()=>{document.getElementById('reset-panel').hidden=true;document.getElementById('restart').focus()};document.getElementById('confirm-reset').onclick=()=>{answers=Array(7).fill(null);current=0;revealed=false;intro();focus()}}
document.getElementById('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){document.getElementById('fullscreen').textContent='Dùng F11 để phóng to'}};
document.addEventListener('fullscreenchange',()=>{document.getElementById('fullscreen').textContent=document.fullscreenElement?'Thoát toàn màn hình':'Toàn màn hình'});
if(screen==='question')question();else if(screen==='summary')summary();else intro();
