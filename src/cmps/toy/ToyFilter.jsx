import { useEffect, useRef, useState } from "react"
import { utilService } from "../../services/util.service"
import { ToySort } from "./ToySort"
import { isEqual } from "lodash"
import { toyService } from "../../services/toy.service"
import { FilterInput } from "./FilterInput"
import { InStock } from "./InStock"

const toyLabels = toyService.getToyLabels()

export function ToyFilter({ filterBy, onSetFilter, sortBy, setSortBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    onSetFilter = useRef(utilService.debounce(onSetFilter))

    useEffect(() => {
        if (isEqual(filterByToEdit, filterBy)) return
        onSetFilter.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        if (type === 'select-multiple') {
            value = Array.from(target.selectedOptions, (option) => option.value)
        }
        value = (type === 'number') ? (+value || '') : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { txt, inStock, labels, pageIdx } = filterByToEdit

    return (
        <section className="toy-filter">
            <h3>Toys Filter/Sort</h3>
            <form onSubmit={onSubmitFilter}>
                <div className="filter-input-wrapper">
                    <input
                        onChange={handleChange}
                        value={txt}
                        type="text"
                        placeholder="Search"
                        name="txt"
                    />
                </div>
                {/* <FilterInput handleChange={handleChange} txt={txt} /> */}
            </form>
            <select name="inStock" value={inStock || ''} onChange={handleChange}>
                <option value="">All</option>
                <option value="true">In Stock</option>
                <option value="false">Not in stock</option>
            </select>
            {/* <InStock inStock={inStock} handleChange={handleChange} /> */}
            <div>
                <select multiple name="labels" value={labels || []} onChange={handleChange}>
                    <option value="">Labels</option>
                    <>
                        {toyLabels.map(label =>
                            <option key={label} value={label}>{label}</option>
                        )}
                    </>
                </select>
            </div>
            <ToySort sortBy={sortBy} setSortBy={setSortBy} />
        </section>
    )
}