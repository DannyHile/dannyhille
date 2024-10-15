import { GistApi } from './GithubApi.js'

const gapi = new GistApi(localStorage.githubPAT??null);
let gists = JSON.parse(localStorage.gists || '[]');
let selected = null;


!(async (forceUpdate) => {
  if(gapi.PAT)
    gists = await gapi.getGists();
  else
    gists = await gapi.getPublicGists('dannyhille');
  localStorage.gists = JSON.stringify(gists);
  renderFiles(gists);
})(true);


leftPane.onclick = async e=>{
  if(e.target.tagName!=='LI')return;
  const fileName =e.target.getAttribute('file-name');
  console.log(e.target.getAttribute('file-type'));
  rightPane.value = await gapi.getFileFromUrl(fileName);;
};

function renderFiles(data=[]) {
  leftPane.innerHTML = data.map((a, i) => `<div><div>[${a.public ? 'public' : 'private'}] [${a.id}]</div><ul>${Object.keys(a.files).map(key => `<li file-name="${a.files[key].raw_url}" file-type="${a.files[key].language}">${key}</li>`).join``}</ul></div><hr />`).join``;
  selected = null;
}


function idClick(id) {
  rightPane.value = '';
  navigator.clipboard.writeText(id);
  /*!(async()=>{
    await gapi.deleteGist(id);
    gists = await gapi.getGists();
    localStorage.gists = JSON.stringify(gists);
    renderFiles(gists);
  })();*/
}

txtGistUserName.onkeydown = btnGetGists.onclick = async e => {
  if (e.type === 'click' || e.code === 'Enter') {
    e.preventDefault();
    rightPane.value = '';
    gists = await gapi.getPublicGists(txtGistUserName.value);
    renderFiles(gists);
  }
};


async function mg() {
  const files = [
    { name: 'index.html', content: '!<doctype html><html><body><h1>test</h1></body></html>' },
    { name: 'index.css', content: 'h1{color:red;}' },
    { name: 'index.js', content: 'console.log("test");' }];
  console.log(await gapi.createGist("I'm testing", files, false));
}
