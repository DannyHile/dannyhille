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

// Events

leftPane.onclick = async e=>{
  console.log(e.target.tagName)
  window.selected=null;
  if(e.target.tagName=='LI'){
    const fileName = e.target.getAttribute('file-name');
    const fileUrl = e.target.getAttribute('file-url');
    const mimeType = e.target.getAttribute('mime-type'); 
    const id = e.target.getAttribute('gist-id');
    const lang = e.target.getAttribute('lang');
    const size = e.target.getAttribute('file-size');
    window.selected = {id,lang,fileName,size,fileUrl,mimeType};
    console.log('selected: %o', window.selected);
    try{
      editorPane.value = await gapi.getFileFromUrl(fileUrl);
    }catch(e){
      window.selected=null;
    }
  }
  else if(e.target.tagName=='GIST-ID'){
    const id = e.target.innerText;
    console.log('id: %s',id);
    navigator.clipboard.writeText(id);
    
  }
};

editorPane.onkeydown = e => {
  if(e.ctrlKey && e.code=='KeyS' && !!window.selected) {
    e.preventDefault();
    if(!gapi.PAT)return console.error("Github personal access token not found");
    console.log("save %o", window.selected  );
    (async ()=>{
      await gapi.updateFile(window.selected.id, window.selected.fileName, editorPane.value);
    })();
    //gists = await gapi.getGists();
    //localStorage.gists = JSON.stringify(gists);
    //renderFiles(gists);
    
  }
};

txtGistUserName.onkeydown = btnGetGists.onclick = async e => {
  if (e.type === 'click' || e.code === 'Enter') {
    e.preventDefault();
    editorPane.value = '';
    gists = await gapi.getPublicGists(txtGistUserName.value);
    renderFiles(gists);
  }
};

// Helpers

function renderFiles(data=[]) {
  leftPane.innerHTML = data.map((a, i) => `<div><div>[${a.public ? 'public' : 'private'}] [<gist-id>${a.id}</gist-id>]</div><ul>${Object.keys(a.files)
    .map(key => `<li 
      gist-id="${a.id}"
      is-public="${a.public}"
      file-name="${a.files[key].filename}"
      file-url="${a.files[key].raw_url}"
      file-size="${a.files[key].size}"
      mime-type="${a.files[key].type}"
      lang="${a.files[key].language}">${key}</li>`)
    .join``}</ul></div><hr />`)
    .join``;
  selected = null;
}




function idClick(id) {
  editorPane.value = '';
  navigator.clipboard.writeText(id);
  /*!(async()=>{
    await gapi.deleteGist(id);
    gists = await gapi.getGists();
    localStorage.gists = JSON.stringify(gists);
    renderFiles(gists);
  })();*/
}




async function mg() {
  const files = [
    { name: 'index.html', content: '!<doctype html><html><body><h1>test</h1></body></html>' },
    { name: 'index.css', content: 'h1{color:red;}' },
    { name: 'index.js', content: 'console.log("test");' }];
  console.log(await gapi.createGist("I'm testing", files, false));
}
