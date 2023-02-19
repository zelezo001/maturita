<template>
  <div class="Question">
    <div class="QuestionHeader">
      <div class="QuestionHeaderControl QuestionHeaderControlLeft">
        <slot name="header-before">
        </slot>
      </div>
      <h2 class="QuestionHeaderTitle">{{ question.name }}</h2>
      <div class="QuestionHeaderControl QuestionHeaderControlRight">
        <slot name="header-after">
        </slot>
      </div>
    </div>
    <div class="QuestionBody">
      <div class="QuestionBodyBook" v-for="(book, index) in question.books" :key="book.id"
           :class="book.id === selectedBook?.id ? 'QuestionBodyBook-selected' : '' " @click.prevent="selectBook(book)">
        <div class="Checkbox">
          <div class="CheckboxContent"></div>
        </div>
        <div class="QuestionBodyBookAuthor" :title="book.author">{{ book.author }}</div>
        <div class="QuestionBodyBookName" :title="book.name">{{ book.name }}</div>
        <div class="QuestionBodyBookLine" v-if="index+1 !== question.books.length">
          <div class="QuestionBodyBookLineContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {PropType, SetupContext} from "vue";
import {Book, Question} from "@/model/Model";

export default {
  name: "QuestionComponent",
  emits: ["book-selected"],
  props: {
    question: {
      required: true,
      type: Object as PropType<Question>
    },
    selectedBook: {
      required: false,
      type: Object as PropType<Book | null>,
      default: null
    }
  },
  setup: function (props: any, ctx: SetupContext) {
    const selectBook = (book: Book) => {
      ctx.emit("book-selected", book)
    }

    return {selectBook}
  }
}
</script>

<style lang="scss">
.Question {
  padding-left: 3em;
  padding-right: 3em;
  &Header {
    padding-bottom: 1.4em;
    display: grid;
    width: 100%;
    grid-template-columns: 15% 70% 15%;
    column-gap: .5em;
    grid-template-areas:
        "left-control title right-control";
    @media (max-width: 40rem) {
      grid-template-columns: 50% 50%;
      row-gap: 1em;
      grid-template-areas:
        "left-control right-control"
        "title title";
      & > * {
        justify-self: center;
      }
    }
    align-items: flex-start;

    &Title {
      margin: 0;
      text-align: center;
      grid-area: title;
      text-overflow: ellipsis;
    }

    &Control {
      &Right {
        justify-self: right;
        grid-area: right-control;
      }

      &Left {
        justify-self: left;
        grid-area: left-control;
      }
    }
  }

  &Body {
    display: flex;
    flex-flow: column;
    gap: .5em;

    &Book {
      cursor: pointer;
      width: 100%;
      display: grid;
      grid-template-columns: 1em 25% calc(75% - 1em);
      column-gap: .5em;
      row-gap: .4em;
      grid-template-areas:
    "checkbox author name"
    "none line line";

      &Name {
        padding-right: 2em;
        grid-area: name;
      }

      &Line {
        grid-area: line;
        width: 100%;
        height: 1px;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;

        &Content {
          width: 60%;
          height: 100%;
          background: var(--border-color);
        }
      }

      &Author {
        grid-area: author;
      }

      &Author, &Name {
        font-size: 1.3rem;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .Checkbox {
        width: 1.1em;
        height: 1.1em;
        border-radius: .25em;
        border: var(--border-color) solid 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;

        &Content {
          border-radius: 0;
          $size: 100%;//.60em
          width: $size;
          height: $size;
        }
      }

      &-selected .Checkbox > .CheckboxContent {
        background: var(--main-color);
      }
    }
  }
}
</style>
