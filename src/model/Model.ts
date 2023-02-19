import * as t from "io-ts";

export type Question = typeof QuestionType._A

export const BookType = t.type({
    author: t.string,
    name: t.string,
    id: t.string
})

export type Book = typeof BookType._A

export const QuestionType = t.type({
    number: t.number,
    name: t.string,
    id: t.string,
    books: t.array(BookType)
})

export enum Class {
    OKTAVA_A = "oktava-a",
    OKTAVA_B = "oktava-b",
    FOURTH_A = "ctvrta-a"
}

export function className(c: Class) {
    if (c === Class.OKTAVA_B) {
        return "Oktáva B"
    }
    if (c === Class.OKTAVA_A) {
        return "Oktáva A"
    }
    if (c === Class.FOURTH_A) {
        return "4. A"
    }

    return c
}

const ClassType = t.union([
    t.literal(Class.FOURTH_A),
    t.literal(Class.OKTAVA_A),
    t.literal(Class.OKTAVA_B)
])
export const DataType = t.type({
    class: ClassType,
    name: t.string,
    books: t.record(t.string, t.string)
})

export type Data = typeof DataType._A

export const QuestionsValidator = t.array(QuestionType)
