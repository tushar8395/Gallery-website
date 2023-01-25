(function () {
    let saveAlbum = document.querySelector("#saveAlbum");
    let addAlbum = document.querySelector("#addAlbum");
    let deleteAlbum = document.querySelector("#deleteAlbum");
    let importAlbum = document.querySelector("#importAlbum");
    let exportAlbum = document.querySelector("#exportAlbum");
    let playAlbum = document.querySelector("#playAlbum");
    let selectAlbum = document.querySelector("#selectAlbum");
    let allTemplates = document.querySelector("#allTemplates");
    let overlay = document.querySelector("#overlay");
    let contentDetailsOverlay = document.querySelector("#content-details-overlay")
    let newSlide = document.querySelector("#new-slide")
    let createSlide = document.querySelector("#create-Slide");
    let showSlide = document.querySelector("#show-Slide");
    let btnSaveSlide = document.querySelector("#btnSaveSlide");
    let txtSlideImage = document.querySelector("#txtSlideImage")
    let txtSlideTitle = document.querySelector("#txtSlidetitle")
    let txtSlideDesc = document.querySelector('#txtSlideDesc')
    let slideList = document.querySelector("#slide-list")
    let uploadFile=document.querySelector("#uploadFile");


    let albums = [];

    addAlbum.addEventListener("click", handleAddAlbum);
    selectAlbum.addEventListener("change", handleSelectAlbum);
    newSlide.addEventListener("click", handleNewSlideClick)
    btnSaveSlide.addEventListener("click", handleSaveSlide);
    saveAlbum.addEventListener("click",saveToLocalStorage)
    deleteAlbum.addEventListener("click",handleDeleteAlbum);
    exportAlbum.addEventListener("click",handleExportAlbum);
    importAlbum.addEventListener("click",function(){
           uploadFile.click();
    })

    uploadFile.addEventListener("change",handleImportAlbum);
    playAlbum.addEventListener("click",handlePlayAlbum)
       

    function handleAddAlbum() {
        let albumName = prompt("Enter a name for the new album");
        if (albumName == null) {
            return;
        }

        albumName = albumName.trim();
        if (!albumName) {
            alert("Empty name not allowed");
            return;
        }

        let exists = albums.some(a => a.name == albumName);
        if (exists) {
            alert(albumName + " already exists. Please use a unique new name");
            return;
        }

        let album = {
            name: albumName,
            selected: false,
            slides: []
        };
        albums.push(album);

        let optionTemplate = allTemplates.content.querySelector("[purpose=new-album]");
        let newAlbumOption = document.importNode(optionTemplate, true);

        newAlbumOption.setAttribute("value", albumName);

        newAlbumOption.innerHTML = albumName;
        selectAlbum.append(newAlbumOption);

        selectAlbum.value = albumName;
        selectAlbum.dispatchEvent(new Event("change"));
    }

    function handleSelectAlbum() {
        if (this.value == "-1") {
            overlay.style.display = "block";
            contentDetailsOverlay.style.display = "none";
            createSlide.style.display = "none"
            showSlide.style.display = "none"
            slideList.innerHTML=""
        } else {
            overlay.style.display = "none";
            contentDetailsOverlay.style.display = "block";
            createSlide.style.display = "none"
            showSlide.style.display = "none"

            let album = albums.find(a => a.name == selectAlbum.value)

            slideList.innerHTML = ""
            for (let i = 0; i < album.slides.length; i++) {
            

                let slideTemplate = allTemplates.content.querySelector(".slide");
                let slide = document.importNode(slideTemplate, true);

                slide.querySelector(".title").innerHTML = album.slides[i].title
                slide.querySelector(".desc").innerHTML = album.slides[i].desc;
                slide.querySelector("img").setAttribute("src", album.slides[i].url);
                slide.addEventListener("click", handleSlideClick)
                album.slides[i].selected=false;
                slideList.append(slide);

            }
        }



    }
    function handlePlayAlbum(){
        if(selectAlbum.value==-1){
            alert("select an album to play")
            return ;
        }

        let album=albums.find(a=>a.name==selectAlbum.value);
        let counter=album.slides.length;
        let i=0;
        let id=setInterval(function(){
            if(i<counter){
                slideList.children[i].click();
                i++
            }
            else if(i==counter){
                clearInterval(id)
            }
            
        },500);

    }
    
    

    function handleNewSlideClick() {
        overlay.style.display = "none";
        contentDetailsOverlay.style.display = "none";
        createSlide.style.display = "block"
        showSlide.style.display = "none"

        txtSlideImage.value = ""
        txtSlideDesc.value = "";
        txtSlideTitle.value = ""

        btnSaveSlide.setAttribute("purpose","create");

    }

    function handleSaveSlide() {

        let url = txtSlideImage.value;
        let title = txtSlideTitle.value;
        let desc = txtSlideDesc.value;
        
        
        if(this.getAttribute("purpose")=="create"){
        let slideTemplate = allTemplates.content.querySelector(".slide");
        let slide = document.importNode(slideTemplate, true);

        slide.querySelector(".title").innerHTML = title
        slide.querySelector(".desc").innerHTML = desc;
        slide.querySelector("img").setAttribute("src", url)
        slide.addEventListener("click", handleSlideClick);
        slideList.append(slide);
        let album = albums.find(a => a.name == selectAlbum.value);
        album.slides.push({
            title: title,
            url: url,
            desc: desc
        })
        slide.dispatchEvent(new Event("click"))
 }
        else{
            let album = albums.find(a => a.name == selectAlbum.value);
            let slideToUpdate=album.slides.find(s=>s.selected==true)

            console.log("slide to edit >>>> " + slideToUpdate.title)
            
            let slideDivToUpdate;
            for(let i=0;i<slideList.children.length;i++){
                let slideDiv=slideList.children[i];
                if(slideDiv.querySelector(".title").innerHTML==slideToUpdate.title){
                slideDivToUpdate=slideDiv
                console.log("slide to  update>>>>"+ slideDivToUpdate.querySelector(".title").innerHTML)
                break;
                }
            }
        
            console.log("slide to  update>>>>"+ slideDivToUpdate.querySelector(".title").innerHTML)


            






           //alert("edit>>>" + slideDivToUpdate.querySelector('.title').innerHTML)
           console.log('url>>>>'+ url)
           console.log('title>>>'+title)
           console.log("desc>>>"+desc)

            slideDivToUpdate.querySelector(".title").innerHTML=title
            slideDivToUpdate.querySelector(".desc").innerHTML=desc
            slideDivToUpdate.querySelector("img").setAttribute("src",url);

            slideToUpdate.url=url
            slideToUpdate.title=title
            slideToUpdate.desc=desc;

            slideDivToUpdate.dispatchEvent(new Event("click"))
        }

    }


    function handleSlideClick() {
        overlay.style.display = "none";
        contentDetailsOverlay.style.display = "none";
        createSlide.style.display = "none"
        showSlide.style.display = "block"




        showSlide.innerHTML = "";

        let slideInViewTemplate = allTemplates.content.querySelector(".slide-in-view")
        let slideInView = document.importNode(slideInViewTemplate, true);


        slideInView.querySelector(".title").innerHTML = this.querySelector(".title").innerHTML
        slideInView.querySelector(".desc").innerHTML = this.querySelector(".desc").innerHTML
        slideInView.querySelector("img").setAttribute("src", this.querySelector('img').getAttribute("src"));
        slideInView.querySelector("[purpose=edit]").addEventListener("click",handleEditSlideClick)
        slideInView.querySelector("[purpose=delete]").addEventListener("click",handleDeleteSlideClick);
        showSlide.append(slideInView)

        let album=albums.find(a=>a.name==selectAlbum.value);
        for(let i=0;i<album.slides.length;i++){
            if(album.slides[i].title==this.querySelector(".title").innerHTML){
                album.slides[i].selected=true;

            }
            else{
                album.slides[i].selectAlbum=false;
            }
        }
    }

    function handleEditSlideClick(){
        overlay.style.display = "none";
        contentDetailsOverlay.style.display = "none";
        createSlide.style.display = "block"
        showSlide.style.display = "none"

        let album=albums.find(a=>a.name==selectAlbum.value);
        let slide=album.slides.find(s=>s.selected==true);


        txtSlideImage.value = slide.url
        txtSlideDesc.value = slide.desc
        txtSlideTitle.value = slide.title

        btnSaveSlide.setAttribute("purpose","update");

    }
    function handleDeleteSlideClick(){
        
        let album=albums.find(a=>a.name==selectAlbum.value)
        let sidx=album.slides.findIndex(s=>s.selected==true);

        let slideTBD;
        for(let i=0;i<slideList.children.length;i++){
            let slideDiv=slideList.children[i];
            if(slideDiv.querySelector('.title').innerHTML==album.slides[sidx].title){
                slideTBD=slideDiv;
                break;
            }
        }
        alert("deleting "+slideTBD.querySelector(".title").innerHTML)
        album.slides.splice(sidx,1)
        slideList.removeChild(slideTBD)
    

        overlay.style.display = "none";
        contentDetailsOverlay.style.display = "block";
        createSlide.style.display = "none"
        showSlide.style.display = "none"



    }

    function handleDeleteAlbum(){
        if(selectAlbum.value==-1){
            alert("select an album to delete")
            return -1;
        }
        let aidx=albums.findIndex(a=>a.name==selectAlbum.value)
        albums.splice(aidx,1);
        selectAlbum.remove(selectAlbum.selectedIndex);

        selectAlbum.value=-1;
        selectAlbum.dispatchEvent(new Event("change"));

    }

    function handleExportAlbum(){
        if(selectAlbum.value==null){
            alert("pleasee select an album to export");
            return;
        }
        let album=albums.find(a=>a.name==selectAlbum.value);
        let ajson=JSON.stringify(album);
        let encodedJson=encodeURIComponent(ajson);

        let a=document.createElement("a");
        a.setAttribute("download",album.name+".json");
        a.setAttribute("href","data:text/json; charset=utf-8, "+encodedJson)
        a.click();

    }

    function handleImportAlbum(){
        if(selectAlbum.value==-1){
            alert("please select an album to import")
            return;
        }

        let file=window.event.target.files[0];
        let reader=new FileReader();
        reader.addEventListener("load",function(){
            let data=window.event.target.result;
            let importAlbum=JSON.parse(data);
            console.log(importAlbum.slides)

            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

            
            let album=albums.find(a=>a.name==selectAlbum.value);
            
            console.log(album.slides)
            album.slides=album.slides.concat(importAlbum.slides)
            

            slideList.innerHTML = ""
            for (let i = 0; i < album.slides.length; i++) {
            

                let slideTemplate = allTemplates.content.querySelector(".slide");
                let slide = document.importNode(slideTemplate, true);

                slide.querySelector(".title").innerHTML = album.slides[i].title
                slide.querySelector(".desc").innerHTML = album.slides[i].desc;
                slide.querySelector("img").setAttribute("src", album.slides[i].url);
                slide.addEventListener("click", handleSlideClick)
                album.slides[i].selected=false;
                slideList.append(slide);

            }
        

            


        })
        reader.readAsText(file);
        
    }

    function saveToLocalStorage(){
        alert("save??")
        let json=JSON.stringify(albums);
        localStorage.setItem("data",json);
    }

    function loadFromLocalStorage(){
        let json=localStorage.getItem("data");
        if(!json){
            return;
        }
        albums=JSON.parse(json);
        for(let i=0;i<albums.length;i++){
            let optionTemplate=allTemplates.content.querySelector("[purpose=new-album]")
            let newAlbumOption=document.importNode(optionTemplate,true);

            newAlbumOption.setAttribute("value",albums[i].name)
            newAlbumOption.innerHTML=albums[i].name;
            selectAlbum.appendChild(newAlbumOption)

        }
        selectAlbum.value="-1";
    }

    loadFromLocalStorage();










})();
