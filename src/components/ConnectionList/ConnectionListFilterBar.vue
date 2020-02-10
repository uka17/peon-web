<template>
  <div class="field has-addons">
    <div class="control">
      <input class="input" id="connection-list-filter" type="text" v-model="filterText" @keyup.enter="doFilter" placeholder="Connection name, host or login">
    </div>
    <div class="control">
      <a class="button is-info" @click="doFilter">
        Filter
      </a>
    </div>
    <div class="control">
      <a class="button" @click="resetFilter">
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
  .vuetable-th-slot-schedule-name {
    width: 50px;
  }
  #connection-list-filter {
	width: 280px;
  }

</style>