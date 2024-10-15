import GistApi from './GithubApi.js'
  //*****************************************/
  
  const gapi = new GistApi(localStorage.githubPAT); 
  let gists = JSON.parse(localStorage.gists||'[]');
  let selected = null;
  
  
  !(async(forceUpdate)=>{
    if(!forceUpdate && gists?.length>0){
      renderFiles(gists);
    } 
    else {
      gists = await gapi.getGists();
      localStorage.gists = JSON.stringify(gists);
      renderFiles(gists);
    }
  })(true);
  
  
  function renderFiles(data){
    leftPane.innerHTML = data.map((a,i)=>`<div><div>${a.description}&nbsp;(${a.public?'public':'private'}) <a href="javascript:idClick('${a.id}')">[${a.id}]</a></div><ul>${Object.keys(a.files).map(key=>`<li onclick="loadFile('${a.files[key].raw_url}','${a.files[key].language}')">${key}</li>`).join``}</ul></div><hr />`).join``;
    selected=null;
  }
  
  
  function idClick(id){
    rightPane.value='';
    navigator.clipboard.writeText(id);
    /*!(async()=>{
      await gapi.deleteGist(id);
      gists = await gapi.getGists();
      localStorage.gists = JSON.stringify(gists);
      renderFiles(gists);
    })();*/
  }
  
  
  
  async function loadFile(url, lang){
    rightPane.value='';
    rightPane.value=await gapi.getFileFromUrl(url);;
  }
  
  txtGistUserName.onkeydown = btnGetGists.onclick = async e =>{
    if(e.type==='click'||e.code==='Enter'){
      e.preventDefault();
      rightPane.value='';
      gists = await gapi.getPublicGists(txtGistUserName.value);
      renderFiles(gists);
    }
  };
  
  
  async function  mg(){
    const files = [
      {name:'index.html',content:'!<doctype html><html><body><h1>test</h1></body></html>'},
      {name:'index.css',content:'h1{color:red;}'},
      {name:'index.js',content:'console.log("test");'}];
    console.log(await gapi.createGist("I'm testing",files,false));
  }
  