
<script>
import { text } from './utils'

/**
 * This is an example of creating a reusable grid component and using it with external data.
 * @version 1.0.5
 * @author [Rafael](https://github.com/rafaesc92)
 * @since Version 1.0.1
 */
export default {
  name: 'grid',
  props: {
    /**
     * object/array defaults should be returned from a factory function
     * @version 1.0.5
     * @since Version 1.0.1
     * @see See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names
     * @link See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names
     */
    msg: {
      type: [String, Number],
      default: text,
    },
    /**
     * describe data
     * @version 1.0.5
     */
    data: Array,

    images: {
      type: Array,
      default: function() {
        return [{}]
      },
    },
    /**
     * prop function
     */
    propFunc: {
      default: function() {},
    },
    /**
     * get columns list
     */
    columns: [Array],
    /**
     * filter key
     * @ignore
     */
    filterKey: {
      type: String,
      default: 'example',
    },
  },
  data() {
    var sortOrders = {}
    this.columns.forEach(function(key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
    }
  },
  computed: {
    filteredData: function() {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function(row) {
          return Object.keys(row).some(function(key) {
            return (
              String(row[key])
                .toLowerCase()
                .indexOf(filterKey) > -1
            )
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function(a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    },
  },

  render() {
    const { sortKey, capitalize } = this
    return (
      <table class="grid">
        <thead>
          <tr>
            {columns.map(key => (
              <th onClick={() => sortBy(key)} class={{ active: sortKey == key }}>
                {capitalize(key)}
                <span class={'arrow ' + (sortOrders[key] > 0 ? 'asc' : 'dsc')} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{filteredData.map(entry => columns.map(key => entry[key]))}</tbody>
      </table>
    )
  },

  methods: {
    /**
     * Sets the order
     *
     * @public
     * @version 1.0.5
     * @since Version 1.0.1
     * @param {string} key Key to order
     * @returns {string} Test
     */
    sortBy: function(key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1

      /**
       * Success event.
       *
       * @event success
       * @type {object}
       */
      this.$emit('success', {
        demo: 'example success',
      })
    },

    hiddenMethod: function() {
      /**
       * Error event.
       *
       * @event error
       * @type {object}
       */
      this.$emit('error', {
        demo: 'example error',
      })
    },
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
  },
}
</script>

<style scoped>
.grid {
  margin-bottom: 20px;
}
</style>
