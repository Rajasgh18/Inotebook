import React, { useContext, useState } from "react";
import noteContext from "../Context/Notes/noteContext";
function AddNote(props) {
    const {addNote} = useContext(noteContext);
    const [note, setNote] = useState({title:"", description:"", tag:""});
    const handleChange = (e)=>{
        setNote({...note, [e.target.name]:e.target.value});
    }
    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag, props.authToken);
        setNote({title:"", description:"", tag:""});
        props.showAlert("Added a Note", "primary");
    }
    return (
        <>
            <div className="container my-4">
                <h2>Add Note</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={handleChange} />
                    </div>
                    <button disabled={note.title.length <=3 || note.description.length <= 5 || note.tag.length <= 3} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>
            </div>
        </>
    );
}

export default AddNote;