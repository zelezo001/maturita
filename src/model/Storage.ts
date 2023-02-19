import {Class, Data, DataType, Question} from "./Model";


const localStorageKey = "stored_data"

function newData(): Data {
    return {
        class: Class.OKTAVA_A,
        name: "",
        books: {}
    }
}

export function Store(data: Data) {
    localStorage.setItem(localStorageKey, JSON.stringify(data))
}

export function Load(questions: Map<string, Question>): Data {
    const loaded = localStorage.getItem(localStorageKey)
    if (!loaded) {
        return newData()
    }

    const data = JSON.parse(loaded)
    if (DataType.is(data)) {
        for (const key in data.books) {
            const q = questions.get(key)
            if (q === undefined || !q.books.some(value => data.books[key] === value.id)) {
                return newData()
            }
        }
        return data
    }

    return newData()
}

export function Clear() {
    localStorage.removeItem(localStorageKey)
}
