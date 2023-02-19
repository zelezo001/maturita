<template>
  <ErrorModal v-show="validationErrorsModalOpened" :errors="validationErrors"
              @closed="validationErrorsModalOpened = false"></ErrorModal>
  <div class="App">
    <div class="Title">
      <h1>
        Seznam maturitní četby
      </h1>
    </div>
    <QuestionComponent class="ContentBox" v-if="question != null" :question="question" :selected-book="book"
                       @book-selected="bookSelected(question, $event)">
      <template v-slot:header-before>
        <span class="Control" :class="questionPager.back ? '' : 'Hidden'" @click.stop="questionPager.toPreviousPage()">
           <svg height="48" width="48" xmlns="http://www.w3.org/2000/svg"><path
               d="m32.75 44-20-20 20-20 2.8 2.85L18.4 24l17.15 17.15Z"/></svg>
        </span>
      </template>
      <template v-slot:header-after>
        <span class="Control Reversed" :class="questionPager.next ? '' : 'Hidden'"
              @click.stop="questionPager.toNextPage()">
          <svg height="48" width="48" xmlns="http://www.w3.org/2000/svg"><path
              d="m32.75 44-20-20 20-20 2.8 2.85L18.4 24l17.15 17.15Z"/></svg>
        </span>
      </template>
    </QuestionComponent>
    <GenerateOverview v-if="questionPager.showOverview" class="ContentBox" :data="userData"
                      @class-selected="classSelected($event)"
                      @name-changed="nameChanged($event)"
    >
      <template v-slot:header-before>
        <span class="Control" :class="questionPager.back ? '' : 'Hidden'" @click.stop="questionPager.toPreviousPage()">
           <svg height="48" width="48" xmlns="http://www.w3.org/2000/svg"><path
               d="m32.75 44-20-20 20-20 2.8 2.85L18.4 24l17.15 17.15Z"/></svg>
        </span>
      </template>
      <template v-slot:default>
        <div class="PrintBox">
          <button class="Button" @click.stop="download()">
            Vytisknout
          </button>
        </div>
      </template>
    </GenerateOverview>
    <div class="ContentBox SelectedList" v-show="showList">
      <SelectedList :data="userData" :questions="mappedQuestions" :books="mappedBooks"
                    @question-selected="questionSelected($event)"></SelectedList>
      <div class="ControlBox">
        <button class="Button" @click.stop="deleteData()">
          Smazat
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import QuestionComponent from "@/components/QuestionComponent.vue";
import {Book, Class, Question, Question as QuestionType} from "@/model/Model";
import {computed, PropType, ref, watch} from "vue";
import {Clear, Load, Store} from "@/model/Storage";
import SelectedList from "@/components/SelectedList.vue";
import GenerateOverview from "@/components/GenerateOverview.vue";
import {printData, validateData} from "@/model/Print";
import ErrorModal from "@/components/ErrorModal.vue";

export default {
  name: 'App',
  components: {ErrorModal, GenerateOverview, SelectedList, QuestionComponent},
  props: {
    questions: {
      required: true,
      type: Array as PropType<Question[]>
    }
  },
  setup(props: any) {
    const questions: Question[] = props.questions.filter(() => true)
    const mappedQuestions = new Map<string, Question>()
    const mappedBooks = new Map<string, Book>()
    const validationErrors = ref<string[]>([])
    const validationErrorsModalOpened = ref(false)
    questions.forEach(q => {
      mappedQuestions.set(q.id, q)
      q.books.forEach(b => mappedBooks.set(b.id, b))
    })
    const userData = ref(Load(mappedQuestions))
    const index = ref(0);
    const question = computed(() => {
      if (index.value < questions.length) {
        return questions[index.value]
      } else {
        return null
      }
    })
    const book = computed(() => {
      if (index.value < questions.length) {
        const question = questions[index.value]
        return question.books.find(b => b.id === userData.value.books[question.id]) ?? null
      } else {
        return null
      }
    })

    const bookSelected = (question: QuestionType, book: Book) => {
      userData.value.books[question.id] = book.id
    }

    const questionPager = computed(() => {
      return {
        back: index.value > 0,
        next: index.value <= questions.length,
        showOverview: index.value === questions.length,
        toNextPage() {
          if (this.next) {
            index.value++
          }
        },
        toPreviousPage() {
          if (this.back) {
            index.value--
          }
        }
      }
    })

    const questionSelected = (q: Question) => {
      const i = questions.findIndex(question => q.id == question.id)
      if (i > -1) {
        index.value = i
      }
    }

    const deleteData = () => {
      Clear()
      userData.value = Load(mappedQuestions)
      index.value = 0
    }

    const saveData = () => {
      Store(userData.value)
    }

    const showList = computed(() => {
      return Object.getOwnPropertyNames(userData.value.books).length > 0
    })

    watch(userData, () => {
      saveData()
    }, {
      deep: true
    })

    const download = () => {
      const {result, errors} = validateData(userData.value, questions)
      if (!result) {
        validationErrors.value = errors
        validationErrorsModalOpened.value = true
      } else {
        printData(userData.value, questions, mappedBooks)
      }
    }
    return {
      deleteData,
      saveData,
      questionPager,
      question,
      book,
      bookSelected,
      userData,
      mappedBooks,
      mappedQuestions,
      questionSelected,
      nameChanged: (name: string) => userData.value.name = name,
      classSelected: (c: Class) => userData.value.class = c,
      download,
      validationErrors,
      validationErrorsModalOpened,
      showList
    }
  }
}
</script>

<style lang="scss">
#app {
  @media (max-width: 40rem) {
    position: relative;
  }
}

:root {
  --font-color: #000;
  --main-color: rgba(55, 77, 94);
  --second-color: rgba(114, 129, 147);
  --border-color: var(--main-color);
  --hover-color: rgba(79, 101, 118);
  --color-white: #ECECEC;
}

html {
  color: var(--font-color);
  background: rgb(55, 77, 94);
  //background: linear-gradient(90deg, var(--main-color) 0%, var(--second-color) 50%);
  background: linear-gradient(111.48deg, #374D5E 0%, rgba(114, 129, 147, 0.5) 100%);
  min-height: 100%;
}

.App {
  width: 100%;
  padding: 5em 10%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 4em;
  box-sizing: border-box;

  @media (max-width: 40rem) {
    padding: 0 2% 2em 2%;
    gap: 2em;
  }
}

.Control {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  background: var(--main-color);
  border-radius: 100%;
  cursor: pointer;
  transform: scale(80%);

  svg {
    fill: var(--color-white);
    transform: scaleY(70%) translateX(-3px);
  }

  &.Reversed {
    transform: rotate(180deg) scale(80%);
    @media (max-width: 40rem) {
      transform: scale(120%) rotate(180deg);
    }
  }

  &.Hidden {
    visibility: hidden;
  }

 &:active {
    cursor: pointer;
    background: var(--hover-color);
  }

  @media (hover: hover) {
    &:hover {
      cursor: pointer;
      background: var(--hover-color);
    }
  }

  @media (max-width: 40rem) {
    transform: scale(120%);
  }
}

.ContentBox {
  width: 45rem;
  border: var(--font-color) black solid;
  background: var(--color-white);
  border-radius: 2em;
  padding: 2em 3em;
  box-sizing: border-box;
  $size: .4em;
  box-shadow: $size $size $size rgba(0, 0, 0, 0.25);

  @media (max-width: 40rem) {
    width: 100%;
    padding: 2em 1.5em;
  }
}

.SelectedList {
  width: 35rem;

  @media (max-width: 40rem) {
    width: 100%;
  }
}

.ControlBox {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: space-around;
  padding: 0.3em 2em;
}


.PrintBox {
  display: flex;
  justify-content: right;
}


.Button {
  text-transform: uppercase;
  border-radius: 0.4em;
  padding: .4em 1.5em;
  font-size: 1.1rem;
  border: none;
  background: var(--main-color);
  color: var(--color-white);

  &:active {
    cursor: pointer;
    background: var(--hover-color);
  }

  @media (hover: hover) {
    &:hover {
      cursor: pointer;
      background: var(--hover-color);
    }
  }
}


.Title {
  text-align: center;
  width: 100%;
  text-transform: uppercase;
  color: var(--color-white);

  h1 {
    font-weight: 700;
    text-shadow: 6px 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 3rem;
  }
}


h3 {
  font-size: 1.3rem;
}

h2 {
  font-size: 1.5rem;
}

</style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
</style>
<style>
html {
  font-family: 'Roboto', sans-serif;
}

@import '~normalize.css';
</style>
