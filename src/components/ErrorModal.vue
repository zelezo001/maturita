<template>
  <div class="ModalWrapper">
    <div>
      <div class="ContentBox ErrorModal">
        <h2>Výstup kontroly</h2>
        <div class="ErrorModalErrors">
          <div class="ErrorModalErrorsItem" v-for="(error, index) of errors" :key="index">
      <span>
        {{ error }}
      </span>
          </div>
        </div>
        <div class="ErrorModalControl">
          <button class="Button" @click.stop="$emit('closed')">
            Zavřít
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {PropType} from "vue";

export default {
  name: "ErrorModal",
  emits: ["closed"],
  props: {
    "errors": {
      type: Array as PropType<string[]>
    }
  }
}
</script>

<style lang="scss">
.ModalWrapper {
  z-index: 10;
  width: 100%;
  height: 100%;
  top: 0;
  position: absolute;

  background: rgba(0, 0, 0, .3);

  & > * {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    position: sticky;
    top: 0;
  }

}

.ErrorModal {
  padding-right: 2em;
  padding-left: 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: column;
  height: 60%;

  &Control {
    width: 100%;
    display: flex;
    padding: .3em 2em;
    justify-content: right;
  }

  &Errors {
    height: 80%;
    overflow-y: auto;
    &Item {
      color: #8d0000;
      font-weight: 500;
      font-size: 1.1rem;
      padding: 0.3em 0;
    }
  }
}
</style>
