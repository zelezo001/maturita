import { createApp } from 'vue'
import App from './App.vue'
import {QuestionsValidator} from "@/model/Model";

async function init() {
    const data = await (await fetch("./data.json")).json()
    if (!QuestionsValidator.is(data)) {
        throw new Error("could not load data")
    }

    createApp(App, {questions: data}).mount('#app')
}

init().then(() => console.log("application bootstrapped"))
