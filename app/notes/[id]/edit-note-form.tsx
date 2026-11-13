import NoteEditor from '@/app/note-editor'
export default function EditNoteForm({note}:{note:{id:number;title:string;body:string;subject:string;follow_up:string|null}}) {
 return <NoteEditor note={note}/>
}
