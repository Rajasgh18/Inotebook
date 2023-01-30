import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial)
  const authToken = localStorage.getItem('token');

  //Get all Notes
  const getNotes = async() => {
    const response = await fetch(`${host}/api/notes/fetchall`, {
      method : "GET",
      headers : {
        'Content-type' : 'application/json',
        'auth-token' : authToken
      }
    })
    const json = await response.json();
    setNotes(json);
  }

  //Add a Note
  const addNote = async (title, description, tag)=>{
    console.log("Added a Note");
    const response = await fetch(`${host}/api/notes/addnote`, {
      method : 'POST',
      headers : {
        'content-type' : 'application/json',
        'auth-token' : authToken
      },
      body : JSON.stringify({title,description,tag})
    });
    const note = await response.json();
    setNotes(notes.concat(note));
  }

  //Delete a Note
  const deleteNote = async (id)=>{
    const newNote = notes.filter((note)=>{return note._id!==id})
    const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
      method : 'DELETE',
      headers : {
        'Content-type' : 'application/json',
        'auth-token' : authToken
      }
    });
    response.json();
    setNotes(newNote);
  }

  //Update a Note
  const editNote = async (title, description, tag, id)=>{
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method : 'PUT',
      headers : {
        'Content-type' : 'application/json',
        'auth-token' : authToken
      },
      body : JSON.stringify({title, description, tag})
    });
    let newNotes = JSON.parse(JSON.stringify(notes));
    for(let i=0; i<notes.length;i++){
      if(notes[i]._id === id){
        newNotes[i].title = title;
        newNotes[i].description = description;
        newNotes[i].tag = tag;
        break;
      }
    }
    response.json();
    console.log(newNotes);
    setNotes(newNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;