<template>
  <div class="field has-addons">
    <div class="control">
      <input class="input" id="filter-text" type="text" v-model="filterText" @keyup.enter="doFilter" placeholder="Job name or description">
    </div>
    <div class="control">
      <a class="button is-info" id="filter-apply" @click="doFilter">
        Filter
      </a>
    </div>
    <div class="control">
      <a class="button" id="filter-reset" @click="resetFilter">
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
      EventBus.$emit('job-list-filter-set', this.filterText);
    },
    resetFilter () {
      this.filterText = ''
      EventBus.$emit('job-list-filter-reset');
    }
  }
}
</script>