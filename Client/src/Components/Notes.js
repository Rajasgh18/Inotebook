import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import noteContext from "../Context/Notes/noteContext";
import NoteItem from "./NoteItem";
function Notes(props) {
    const context = useContext(noteContext);
    const authToken = localStorage.getItem('token');
    const navigate = useNavigate();
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
        if(authToken){
            getNotes();
        }
        else{
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [])

    const ref = useRef(null);
    const refClose = useRef(null);
    const [note, setNote] = useState({etitle:"", edescription:"", etag:"", id:""});
    const handleChange = (e)=>{
        setNote({...note, [e.target.name]:e.target.value});
    }
    const handleClick = (e)=>{
        e.preventDefault();
        setNote({...note, [e.target.name]:e.target.value});
        editNote(note.etitle, note.edescription, note.etag, note.id, authToken);
        props.showAlert( "Updated your note", "primary");
        refClose.current.click();
       }
    const updateNote = (currNote) => {
        ref.current.click();
        setNote({etitle : currNote.title, edescription : currNote.description, etag : currNote.tag, id : currNote._id});
    }
    return (
        <>
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Edit Note
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={handleChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length <=3 || note.edescription.length <= 5 || note.etag.length <= 3} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <h2>Your Note</h2>
                <div className="container mx-1">
                    {notes.length === 0 && "Your have no notes!"}
                </div>
                {notes.map((note) => {
                    return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />;
                })}
            </div>
        </>
    );
}

export default Notes;