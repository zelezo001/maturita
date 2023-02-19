<template>
  <div class="GenerateOverview">
    <div class="GenerateOverviewHeader">
      <div class="GenerateOverviewHeaderControl GenerateOverviewHeaderControlLeft">
        <slot name="header-before">
        </slot>
      </div>
      <h2 class="GenerateOverviewHeaderTitle">Rekapitulace</h2>
      <div class="GenerateOverviewHeaderControl GenerateOverviewHeaderControlRight">
      </div>
    </div>
    <div class="GenerateOverviewRow">
      <label for="name">Jméno a příjmení: </label>
      <input id="name" type="text" name="name" :value="data.name" @change.stop="nameSelected">
    </div>
    <div class="GenerateOverviewRow">
      <label for="class">Třída: </label>
      <select name="class" id="class" @change.stop="classSelected">
        <option v-for="sClass in classes" :key="sClass" :value="sClass" :selected="sClass === data.class">
          {{ className(sClass) }}
        </option>
      </select>
    </div>
    <slot>

    </slot>
  </div>
</template>

<script lang="ts">
import {PropType, SetupContext} from "vue";
import {Class, className, Data} from "@/model/Model";

const classes = [Class.OKTAVA_A, Class.OKTAVA_B, Class.FOURTH_A]

export default {
  name: "GenerateOverview",
  emits: ["class-selected", "name-changed"],
  methods: {className},
  props: {
    data: {
      required: true,
      type: Object as PropType<Data>
    }
  },
  setup(props: any, ctx: SetupContext) {

    const nameSelected = (e: { target: HTMLInputElement }) => {
      ctx.emit("name-changed", e.target.value)
    }

    const classSelected = (e: { target: HTMLSelectElement }) => {
      ctx.emit("class-selected", e.target.value)
    }

    return {classes, classSelected, nameSelected}
  }
}
</script>

<style lang="scss">
.GenerateOverview {
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
      grid-template-areas:
        "left-control right-control"
        "title title";
    }
    align-items: start;

    &Title {
      margin: 0;
      text-overflow: ellipsis;
      grid-area: title;
      text-align: center;
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

  &Row {
    display: flex;
    justify-content: space-between;
    padding-bottom: 1em;
    gap: .4em;
    flex-wrap: wrap;

    select, input {
      width: 50%;
      display: block;
      box-sizing: content-box;
      background: var(--color-white);
      box-shadow: none;
      border: solid var(--border-color) 1px;
      border-radius: .2em;
      padding: .2em 2em .2em .3em;

      @media (max-width: 40rem) {
        width: 100%;
      }
    }
  }
}
</style>
