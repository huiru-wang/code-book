// import { useState } from "react"

// TODO: add new code
// const CodeForm: React.FC<{ addNewCode: (itemKey: string, itemValue: string) => void }> = ({ addNewCode }) => {

//     const [itemKey, setItemKey] = useState('')
//     const [itemValue, setItemValue] = useState('')

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         addNewCode(itemKey, itemValue);
//     }

//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 placeholder="Code Key"
//                 value={itemKey}
//                 onChange={(e) => setItemKey(e.target.value)}
//                 required
//             />
//             <input
//                 type="text"
//                 placeholder="Code Value"
//                 value={itemValue}
//                 onChange={(e) => setItemValue(e.target.value)}
//                 required
//             />
//             <button type="submit">Add</button>
//         </form>
//     )
// }