import { useState } from "react"
import "./style.css"
export const SearchBar: React.FC<{ onSearch: (searchTerm: string) => void }> = ({ onSearch }) => {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentSearchTerm = e.target.value
        setSearchTerm(currentSearchTerm)
        onSearch(currentSearchTerm)
    }

    return (
        <div className="form-control">
            <input
                className="input input-alt"
                placeholder="Search Key"
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e)}
            />
        </div>
    )
}