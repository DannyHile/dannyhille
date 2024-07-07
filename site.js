class GistApi{
    constructor(githubPersonalAccessToken){
      this.PAT = githubPersonalAccessToken;
    }
  
    privateOpt(){
      return { headers: {
        Authorization: `token ${this.PAT}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json'
      }}
    }
    baseUrl='https://api.github.com';
    publicOpt(){
      return {headers: {'Accept': 'application/vnd.github+json'}};
    }
  
    async getGists(){
      const res = await fetch(`${this.baseUrl}/gists`, 
        this.privateOpt());
      return await res.json();
    }
  
    async getPublicGists(username){
      const res = await fetch(`${this.baseUrl}/users/${username}/gists`, 
        this.publicOpt());
    return await res.json();
    }
  
  
    async getFileFromUrl(gitUrl){
      const res = await fetch(gitUrl);
      return await res.text();
    }
  
    async getGist(id){
      const res = await fetch(`${this.baseUrl}/gists/${id}`, 
        this.privateOpt());
      return await res.json();
    }
  
  
    async deleteGist(id){
     const res = await fetch(`${this.baseUrl}/gists/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${this.PAT}`
      }})
      return await res.ok;
    }
  
    async updateFile(id, fileName, content=null){
      const gist = await this.getGist(id);
      
      gist.files[fileName]=content?{content}:null;
      const request = {
        headers: {'Authorization': `token ${this.PAT}`},
        method:'PATCH',
        body:JSON.stringify(gist)
      };
      const res = await fetch(`${this.baseUrl}/gists/${id}`,
        request);
      return res.json();
    }
  
    async createGist(description, files, isPublic=true){
      const _files = {};
      for(const file of files){
        _files[file.name]={content:file.content};
      }
  
      const request ={
        method: 'POST',
        headers: this.privateOpt().headers,
        body: JSON.stringify({
          description,
          public: isPublic,
          files:_files
        })
      };
  
      const res = await fetch(`${this.baseUrl}/gists`, 
        request);
      return await res.json();
    } 
  }
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
  