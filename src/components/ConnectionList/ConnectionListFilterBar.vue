<template>
  <div class="field has-addons">
    <div class="control">
      <input class="input" id="connection-list-filter" qa-data="connection-list-filter-text" type="text" v-model="filterText" @keyup.enter="doFilter" placeholder="Connection name, host or login">
    </div>
    <div class="control">
      <a class="button is-info" @click="doFilter" qa-data="connection-list-filter-do">
        Filter
      </a>
    </div>
    <div class="control">
      <a class="button" @click="resetFilter" qa-data="connection-list-filter-reset">
        Reset
      </a>
    </div>  
  </div>
</template>

<script>
import { EventBus } from '../../components/utils.js';

export default {
  data () {
    return {
      filterText: ''
    }
  },
  methods: {
    doFilter () {
      EventBus.$emit('connection-list-filter-set', this.filterText);
    },
    resetFilter () {
      this.filterText = ''
      EventBus.$emit('connection-list-filter-reset');
    }
  }
}
</script>
<style lang="scss" >

  #connection-list-filter {
	width: 280px;
  }

</style>