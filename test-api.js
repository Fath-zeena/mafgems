const payload = {
  inputMethod: 'ring-design',
  textPrompt: 'A beautiful diamond ring',
  jewelryType: 'ring',
  gender: 'woman',
  userId: 'e91f370d-feb3-4131-bbea-0023308c5c70'
};

fetch('http://localhost:3000/api/generate-presentation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(d => console.log(JSON.stringify(d, null, 2)))
.catch(e => console.error('Error:', e.message));
