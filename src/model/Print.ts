import {Book, className, Data, Question} from "@/model/Model";
import {PageSizes, PDFDocument} from "pdf-lib";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fontkit from '@pdf-lib/fontkit';
import {getCurrentSchoolYear} from "@/model/SchoolYear";

const fontUrl = "./font.ttf"
const boldFontUrl = "./boldFont.ttf"
const offset = 40;
const defaultFontSize = 14;
const normalLineSize = defaultFontSize + 5
const fileName = "cetba.pdf"

export async function printData(data: Data, questions: Question[], books: Map<string, Book>): Promise<void> {
    try {
        const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer())
        const boldFontBytes = await fetch(boldFontUrl).then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.create()
        pdfDoc.registerFontkit(fontkit)
        const font = await pdfDoc.embedFont(fontBytes)
        const boldFont = await pdfDoc.embedFont(boldFontBytes)
        const getNewPage = () => {
            const page = pdfDoc.addPage(PageSizes.A4)
            page.setFont(font)
            page.setFontSize(defaultFontSize)
            page.moveUp(page.getHeight())
            page.moveRight(offset)
            page.moveDown(offset)
            return page
        }
        let page = getNewPage()
        page.moveDown(20)
        page.drawText("Seznam literárních děl pro ústní zkoušku z českého jazyka", {
            size: 20,
            font: boldFont,
        })

        page.moveDown(15 + defaultFontSize)
        page.drawText("Jméno a příjmení: " + data.name)
        page.moveDown(normalLineSize)
        page.drawText("Třída: " + className(data.class))
        page.moveDown(normalLineSize)
        page.drawText("Školní rok: " + getCurrentSchoolYear())
        page.moveDown(20)

        questions.forEach((question) => {
            const key = data.books[question.id]
            if (key === undefined) {
                return;
            }
            if (page.getY() <= offset + 22 + normalLineSize) {
                page = getNewPage()
            }
            const book = books.get(key)
            if (book === undefined) {
                alert("kniha " + key + " nebyla nalezena")
                return
            }
            page.moveDown(22)
            page.drawText(question.name, {font: boldFont})
            page.moveDown(normalLineSize)
            page.drawText(book.name)
        })

        if (page.getY() - 40 < offset) {
            page = getNewPage()
        }
        page.moveTo(page.getX(), offset)
        const today = new Date();
        page.drawText(`Datum: ${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}`)
        const signatureText = "Podpis: " + ".".repeat(40)
        page.drawText(signatureText, {
            x: page.getWidth() - offset - font.widthOfTextAtSize(signatureText, defaultFontSize),
        })

        const bytes = await pdfDoc.save()
        const blob = new Blob([bytes], {type: "application/pdf"});
        const url = window.URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = fileName
        anchor.click()
    } catch (e) {
        alert(e)
    }
}

export function validateData(data: Data, questions: Iterable<Question>): { result: boolean, errors: string[] } {
    const errors = []
    for (const question of questions) {
        const book = data.books[question.id]
        if (book == undefined || !question.books.some(b => b.id == book)) {
            errors.push(`Pro otázku '${question.name}' není vybrána kniha.`)
        }
    }
    if (data.name == "") {
        errors.push("Není vyplněno jméno.")
    }
    return {
        errors: errors,
        result: errors.length == 0
    }
}

