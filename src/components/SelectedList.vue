<template>
  <div class="List">
    <div class="ListItem" v-for="item in items" :key="item.question.id">
      <h3 class="ListItemQuestion" @click.stop="questionSelected(item)">{{ item.question.name }}</h3>
      <div class="ListItemAuthor" :title="item.book.author">{{ item.book.author }}</div>
      <div class="ListItemBook" :title="item.book.name">{{ item.book.name }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import {computed, PropType, SetupContext, toRefs} from "vue";
import {Book, Data, Question} from "@/model/Model";


interface ListItem {
  book: Book,
  question: Question
}

export default {
  name: "SelectedList",
  emits: ["question-selected"],
  props: {
    "books": {
      required: true,
      type: Object as PropType<Map<string, Book>>
    },
    "questions": {
      required: true,
      type: Object as PropType<Map<string, Question>>
    },
    "data": {
      required: true,
      type: Object as PropType<Data>
    }
  },
  setup(props: any, ctx: SetupContext) {
    const {data, questions, books} = toRefs(props)
    const items = computed(() => {
      const items: ListItem[] = []
      for (const questionId in data.value.books) {
        items.push({
          book: books.value.get(data.value.books[questionId]),
          question: questions.value.get(questionId)
        })
      }
      return items.sort((a, b) => a.question.number - b.question.number)
    })

    const questionSelected = (item: ListItem) => ctx.emit("question-selected", item.question)

    return {items, questionSelected}
  }
}
</script>

<style lang="scss">
.List {
  padding-top: 2em;
  padding-bottom: 3em;
  @media (min-width: calc(40rem + 1px)) {
    min-height: 40vh;
  }
  display: flex;
  flex-flow: column;
  gap: 1em;

  &Item {
    width: 100%;
    display: grid;
    grid-template-columns: 40% 60%;
    column-gap: 1em;
    row-gap: .5em;
    grid-template-areas:
    "header header"
    "author book";

    &Book {
      padding-right: 2em;
      grid-area: book;
    }

    &Author {
      padding-left: 2em;
      grid-area: author;
    }

    &Author, &Book {

      @media (max-width: 40rem) {
        padding: 0;
      }
      font-size: 1.3rem;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &Question {
      margin: 0;
      cursor: pointer;
      grid-area: header;
    }
  }
}
</style>
