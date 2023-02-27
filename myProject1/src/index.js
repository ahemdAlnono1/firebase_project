// routing
document.querySelector(".btnSingup").addEventListener("click" , ()=>{
    document.querySelector(".active").className = "";
    document.getElementById("divSingup").className = "active";
})
document.querySelector(".btnLogin").addEventListener("click" , ()=>{
    document.querySelector(".active").className = "";
    document.getElementById("divLogin").className = "active";
})

import { initializeApp } from "firebase/app";
import { getDocs,collection, getFirestore, query, where, onSnapshot, updateDoc, doc ,addDoc, getDoc, arrayUnion } from "firebase/firestore";
import {getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    // onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAuqsH7ILvdscHeC1gW5fCT2bpHytI_y-k",
    authDomain: "fir-9-lesson-c7436.firebaseapp.com",
    projectId: "fir-9-lesson-c7436",
    storageBucket: "fir-9-lesson-c7436.appspot.com",
    messagingSenderId: "871904458272",
    appId: "1:871904458272:web:952583881651207ef1ee45"
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

// all varible i need
let myName;
let names = [];
let chatArray = [];
let showMessages = [];

// call Reference
const calRefChats = collection(db, 'chats');
const calRefNames = collection(db, 'names');


// send messages input 
const message = document.querySelector("#message");
message.addEventListener('submit' ,async function(e){
    e.preventDefault();
    let i = 0
    const q = query(calRefChats, where("chat" , "==", `${myName},${document.querySelector(".btActive").id}`));
    const qData = await getDocs(q);
    chatArray = [];
    qData.forEach((doc)=>{
    i++;
    chatArray.push({id:doc.id , ...doc.data()})
    })
    if(chatArray.length == 1){
        let num = chatArray[0].messages+1;
        chatArray[0].chatMessages.push(`_${message.send.value}`)
    
        await updateDoc(doc(db , 'chats' , `${chatArray[0].id}`) , {
            chatMessages : arrayUnion(`_${myName}${message.send.value}`),
            messages: num,
        })
        console.log(chatArray);
        console.log(chatArray[0].chatMessages);
    }
    else{
        const q = query(calRefChats, where("chat" , "==", `${document.querySelector(".btActive").id},${myName}`));
        const qData = await getDocs(q);
        chatArray = [];
        qData.forEach((doc)=>{
        i++;
        chatArray.push({id:doc.id , ...doc.data()})
        })
        if(chatArray.length == 1){
            let num = chatArray[0].messages+1;
            chatArray[0].chatMessages.push(`_${num}${message.send.value}`)
        
            await updateDoc(doc(db , 'chats' , `${chatArray[0].id}`) , {
                chatMessages : arrayUnion(`_${myName}${message.send.value}`),
                messages: num,
            })
            console.log(chatArray);
            console.log(chatArray[0].chatMessages);
        }else{
            addDoc(calRefChats,{
                chat: `${myName},${document.querySelector(".btActive").id}`,
                chatMessages: [`_${myName}${message.send.value}`],
                messages: 1,
            })
        }
    }
});

// singup method with create user function
const singup = document.querySelector(".singup")
singup.addEventListener('submit' , (e)=>{
    e.preventDefault();
    createUserWithEmailAndPassword(auth , singup.email.value , singup.password.value).then((cred)=>{
      console.log('user created' , cred.user); // ## need to delete
    }).then(()=>{
        addDoc(calRefNames , {
            name: singup.name.value,
            email: singup.email.value,
            password: singup.password.value,
        })
        window.localStorage.setItem("email" , singup.email.value);
        window.localStorage.setItem("password" , singup.password.value);
        window.localStorage.setItem("name" , singup.name.value);
      singup.reset();
      document.querySelector(".active").className = ""
      document.querySelector(".divChat").className = "active";
      document.querySelector(".chats").classList.add("active");
      document.querySelector(".chatLayout").style.display = "flex";
    }).catch((e)=>{
      console.log(e.message);
    });
  });

    // login with local storage 
    const login = document.querySelector('.login');
  if(window.localStorage.getItem("email") != null && window.localStorage.getItem("password") != null){
      signInWithEmailAndPassword(auth , window.localStorage.getItem("email") , window.localStorage.getItem("password")).then(
          async(cred)=>{
              console.log("user logged in " , cred.user); // ## need to delete
              document.querySelector(".active").className = ""
              document.querySelector(".divChat").classList.add("active");
              document.querySelector(".chats").classList.add("active");
              document.querySelector(".chatLayout").style.display = "flex";
              const q = query(calRefNames , where("email", "==" ,  window.localStorage.getItem("email")));
              const QueryDoc = await getDocs(q);
              QueryDoc.forEach((doc)=>{
                myName = doc.data().name;
                console.log(myName);
              })
            }
      ).catch((e)=>{
        console.log(e.message);
      })
  }

  // login with input form
  login.addEventListener("submit" , (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth , login.email.value , login.password.value).then(
       async (cred)=>{
        console.log("user logged in " , cred.user); // ## need to delete
        window.localStorage.setItem("email" , `${login.email.value}`); 
        window.localStorage.setItem("password" , `${login.password.value}`);
        // add the name
        const q = query(calRefNames , where("email", "==" ,  window.localStorage.getItem("email")));
        const QueryDoc = await getDocs(q);
        QueryDoc.forEach((doc)=>{
          myName = doc.data().name;
          console.log(myName);
          window.localStorage.setItem("name" , `${myName}`);
        })
        login.reset();
        document.querySelector(".active").className = ""
        document.querySelector(".divChat").classList.add("active");
        document.querySelector(".chats").classList.add("active");
        document.querySelector(".chatLayout").style.display = "flex";
    }
    ).catch((e)=>{
        console.log(e.message);
    })
    
});

// get all names and but all names in array this for firs getdoc
    let chats = document.querySelector(".chats");
    getDocs(calRefNames).then((snapshot)=>{
          names = [];
          snapshot.docs.forEach((doc)=>{
              names.push({...doc.data() , id:doc.id})
            })
      }).then(()=>{ // remove all prev name from page
          var child = chats.lastElementChild; 
          while (child) {
              chats.removeChild(child);
              child = chats.lastElementChild;
            } // add names for page
            names.forEach((name)=>{
                let button = document.createElement('button');
                button.className = name.name;
                button.innerText = name.name;
                chats.appendChild(button);
                chats.appendChild(document.createElement('br'));
                button.onclick = function(){
                    console.log(button.className); // ## need to delete
              }
            })})
            //   this is for any changes in the page
            onSnapshot(calRefNames ,(snapshot)=>{
                names = [];
                snapshot.docs.forEach((doc)=>{
                    names.push({...doc.data() , id:doc.id});
                })
                var child = chats.lastElementChild; 
                while (child) {
                    chats.removeChild(child);
                    child = chats.lastElementChild;
                }
                names.forEach((name)=>{
                    let button = document.createElement('button');
                    button.id = name.name;
                    button.innerText = name.name;
                    button.className = name.name;
                    chats.appendChild(button);
                    chats.appendChild(document.createElement('br'));
                    button.addEventListener('click' ,async function(){
                  // check if active button in exist
                  document.querySelector(".btActive") == null 
                  ? 1+1 
                  :document.querySelector(".btActive").className = "";
                  // finsh check
                  button.className = "btActive";
                  console.log(button);
                    names = [];
                    console.log(button.className);

                    // for add the message to the page ############
                    const qData = await getDocs(
                        query(calRefChats,
                             where("chat" , "==", `${myName},${document.querySelector(".btActive").id}`)));
                    showMessages = [];
                    qData.forEach((doc)=>{
                    showMessages.push({id:doc.id , ...doc.data()})
                    })
                        if(showMessages.length == 1){
                        }   else{
                        const qData = await getDocs(
                            query(calRefChats,
                                 where("chat" , "==", `${document.querySelector(".btActive").id},${myName}`)));
                        showMessages = [];
                        qData.forEach((doc)=>{
                        showMessages.push({id:doc.id , ...doc.data()})
                        })
                        if(showMessages.length != 0){
                            console.log(showMessages);
                            console.log(showMessages[0].chatMessages.slice(myName.length+1));
                        }else{
                            console.log(qData);
                        }
                    }
                    var child = document.querySelector(".textMessages").lastElementChild; 
                    while (child) {
                        document.querySelector(".textMessages").removeChild(child);
                        child = document.querySelector(".textMessages").lastElementChild;
                    }
                    for(let i =0 ; i< showMessages[0].chatMessages.length ; i++){
                        let span = document.createElement("span");
                        if(showMessages[0].chatMessages[i].slice(0,myName.length+1) == `_${myName}`){
                            span.className = "sActive";
                            span.innerText = showMessages[0].chatMessages[i].slice(myName.length+1);
                        }else{
                            span.innerText = showMessages[0].chatMessages[i].slice(document.querySelector(".btActive").id.length +1);
                        }
                        document.querySelector(".textMessages").appendChild(span);
                    }
              })
                })
            })
            onSnapshot(calRefChats , async(snapshot)=>{
                    const qData = await getDocs(
                    query(calRefChats,
                         where("chat" , "==", `${myName},${document.querySelector(".btActive").id}`)));
                    showMessages = [];
                    qData.forEach((doc)=>{
                    showMessages.push({id:doc.id , ...doc.data()})
                    })
                    if(showMessages.length == 1){
                    var child = document.querySelector(".textMessages").lastElementChild; 
                    while (child) {
                        document.querySelector(".textMessages").removeChild(child);
                        child = document.querySelector(".textMessages").lastElementChild;
                    }
                    for(let i =0 ; i< showMessages[0].chatMessages.length ; i++){
                        let span = document.createElement("span");
                        if(showMessages[0].chatMessages[i].slice(0,myName.length+1) == `_${myName}`){
                            span.className = "sActive";
                            span.innerText = showMessages[0].chatMessages[i].slice(myName.length+1);
                        }
                        else{
                            span.innerText = showMessages[0].chatMessages[i].slice(document.querySelector(".btActive").id.length +1);
                        }
                        document.querySelector(".textMessages").appendChild(span);
                    }
                    }   
                    
                    else{
                    const qData = await getDocs(
                        query(calRefChats,
                             where("chat" , "==", `${document.querySelector(".btActive").id},${myName}`)));
                    showMessages = [];
                    qData.forEach((doc)=>{
                    showMessages.push({id:doc.id , ...doc.data()})
                    })
                    if(showMessages.length != 0){
                        var child = document.querySelector(".textMessages").lastElementChild; 
                        while (child) {
                            document.querySelector(".textMessages").removeChild(child);
                            child = document.querySelector(".textMessages").lastElementChild;
                        }
                        for(let i =0 ; i< showMessages[0].chatMessages.length ; i++){
                            let span = document.createElement("span");
                            if(showMessages[0].chatMessages[i].slice(0,myName.length+1) == `_${myName}`){
                                span.className = "sActive";
                                span.innerText = showMessages[0].chatMessages[i].slice(myName.length+1);
                            }
                            else{
                                span.innerText = showMessages[0].chatMessages[i].slice(document.querySelector(".btActive").id.length +1);
                            }
                            document.querySelector(".textMessages").appendChild(span);
                        }
                    }
                }
            })
            setTimeout(()=>{
        console.clear();
    },400);