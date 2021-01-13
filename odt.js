const TestComponent = 
{
  data() {
    return {
      targets: [],
      curSort:'id',
      curSortDir:'desc',
      curPage: null,
      numPages: null,
      perPage: 3,
      nameSearch: '',

      editId: null,

      tgtName: '',
      tgtRa: '',
      tgtDec: '',
      tgtEquinox: '',
      tgtMagnitude: '',
      tgtPm: '',
      tgtPa: '',
      tgtOffsets: '',
      tgtAcquisition: '',
      tgtType: '',
    }
  },

  created: function() {
    this.loadTargets()
    this.curPage = 0
    this.numPages = Math.ceil(this.targets.length / this.perPage)
  },

  methods: {
    processTargetForm:function()
    {
      //todo: This would be an API call
      //get target object and update values from form
      var target = (this.editId) ? this.findTargetById(this.editId) : {}
      target.name      = this.tgtName
      target.ra        = this.tgtRa
      target.dec       = this.tgtDec
      target.equinox   = this.tgtEquinox
      target.magnitude = this.tgtMagnitude
      if (!this.editId)
      {
        var lasttarget = this.targets[this.targets.length-1]
        var nextid = lasttarget.id + 1
        target.id = nextid
      }

      //actions for add vs edit
      if (this.editId)
      {
        alert(`updated target with id ${this.editId}`)      
      }
      else
      {
        this.targets.push(target)
        alert(`added new target with id ${nextid}`)      
      }

      this.numPages = Math.ceil(this.targets.length / this.perPage)
    },
    duplicateTarget:function(id)
    {
      alert('dup'+id)
      return true
    },
    editTarget:function(id)
    {
      //find
      var target = this.findTargetById(id)
      this.editId = target.id

      //update form vals
      this.tgtName = target.name
      this.tgtRa = target.ra
      this.tgtDec = target.dec
      this.tgtEquinox = target.equinox
      this.tgtMagnitude = target.magnitude
    },
    deleteTarget:function(id)
    {
      //todo: this would be an API call
      if (!confirm(`delete ${id}?`)) return
      for(var i = 0; i < this.targets.length; i++) {
          if(this.targets[i].id == id) {
              this.targets.splice(i, 1);
              alert('deleted')
              break;
          }
      }      
      this.numPages = Math.ceil(this.targets.length / this.perPage)
      this.onNewTarget()
    },
    findTargetById:function(id)
    {
      var target = null;
      for(var i = 0; i < this.targets.length; i++) {
          if(this.targets[i].id == id) {
              target = this.targets[i]
              break;
          }
      }
      return target
    },
    loadTargets:function()
    {
      //todo: this would be an API call
      this.targets = 
      [
        {id:1, ra:"12:30:30", dec:"+34:35:21", equinox:"1000", magnitude:15, name:"Polaris"},
        {id:2, ra:"13:30:30", dec:"+45:35:21", equinox:"2000", magnitude:10, name:"Vega"},
        {id:3, ra:"12:30:30", dec:"+34:35:21", equinox:"1000", magnitude:15, name:"Alpha Centauri"},
        {id:4, ra:"13:30:30", dec:"+45:35:21", equinox:"2000", magnitude:10, name:"Castor"},
        {id:5, ra:"12:30:30", dec:"+34:35:21", equinox:"1000", magnitude:15, name:"Rigel"},
        {id:6, ra:"13:30:30", dec:"+45:35:21", equinox:"2000", magnitude:10, name:"Sirius"},
        {id:7, ra:"12:30:30", dec:"+34:35:21", equinox:"1000", magnitude:15, name:"Mira"},
        {id:8, ra:"13:30:30", dec:"+45:35:21", equinox:"2000", magnitude:10, name:"Izar"},
      ]

      // var apiurl = 'https://api.openbrewerydb.org/breweries'
      // let data = await fetch(`${apiurl}?page=${this.curPage}&per_page=${this.perPage}&sort=${this.sortStr}`);
      // this.breweries = await data.json();        
    },
    sort:function(s) 
    {
      if(s === this.curSort) {
        this.curSortDir = this.curSortDir==='asc' ? 'desc' : 'asc';
      }
      this.curSort = s;
    },
    changePage:function(delta)
    {
      this.curPage += delta
      this.curPage = (this.curPage < 0) ? 0 : this.curPage
      this.curPage = (this.curPage >= this.numPages) ? this.numPages-1 : this.curPage
    },
    onSearchName:function()
    {
      //NOTE: Nothing to do.  Reactive 'nameSearch' is handled in sortedTargets.
    },
    onClearForm:function()
    {
      this.onNewTarget()
    },
    onNewTarget:function()
    {
      //clear edit id
      this.editId = null

      //clear form vals
      this.tgtName = ""
      this.tgtRa = ""
      this.tgtDec = ""
      this.tgtEquinox = ""
      this.tgtMagnitude = ""      
    }
  },

  computed:
  {
    sortedTargets:function() 
    {
      //sorting
      var sorted = this.targets.slice(0)
      sorted = sorted.sort((a,b) => {
        let modifier = 1;
        if(this.curSortDir === 'desc') modifier = -1;
        if(a[this.curSort] < b[this.curSort]) return -1 * modifier;
        if(a[this.curSort] > b[this.curSort]) return 1 * modifier;
        return 0;
      });

      //pager
      var start = this.curPage * this.perPage
      var end = start + this.perPage
      sorted = sorted.slice(start, end)

      //name search filter
      if (this.nameSearch != '')
      {
        var find = this.nameSearch.toLowerCase()
        var tmp = []
        for (var i=0; i<sorted.length; i++)
        {
          var search = sorted[i].name.toLowerCase()
          if (search.includes(find))
            tmp.push(sorted[i])
        }
        sorted = tmp
      }

      return sorted
    }
  }

}

const app = Vue.createApp(TestComponent)
const vm = app.mount('#app')

