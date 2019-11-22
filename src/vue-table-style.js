export default {
    table: {
      tableWrapper: '',
      tableHeaderClass: 'fixed',
      tableBodyClass: 'vuetable-semantic-no-top fixed',
      tableClass: 'ui blue selectable unstackable celled table',
      loadingClass: 'loading',
      ascendingIcon: 'blue chevron up icon',
      descendingIcon: 'blue chevron down icon',
      ascendingClass: 'sorted-asc',
      descendingClass: 'sorted-desc',
      sortableIcon: 'grey sort icon',
      handleIcon: 'grey sidebar icon',
      renderIcon(classes, options) {
        return `<span><i class="${classes.join(" ")}" ${options}></i></span>`;
      }
    },
  
    pagination: {
      wrapperClass: 'ui right floated pagination menu',
      activeClass: 'active large',
      disabledClass: 'disabled',
      pageClass: 'item',
      linkClass: 'icon item',
      paginationClass: 'ui bottom attached segment grid',
      paginationInfoClass: 'left floated left aligned six wide column',
      dropdownClass: 'ui search dropdown',
      icons: {
        first: 'mdi mdi-skip-backward',
        prev: 'mdi mdi-skip-previous',
        next: 'mdi mdi-skip-next',
        last: 'mdi mdi-skip-forward',
      }
    },
  
    paginationInfo: {
      infoClass: 'left floated left aligned six wide column',
    }
  }