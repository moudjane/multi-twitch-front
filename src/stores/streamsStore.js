import { defineStore } from 'pinia'

export const useStreamsStore = defineStore('streams', {
  state: () => ({
    activeStreams: [],
  }),
  actions: {
    addStream(channelLogin) {
      if (!this.activeStreams.includes(channelLogin) && this.activeStreams.length < 4) {
        this.activeStreams.push(channelLogin)
      }
    },
    removeStream(channelLogin) {
      this.activeStreams = this.activeStreams.filter(stream => stream !== channelLogin)
    },
    clearStreams() {
      this.activeStreams = []
    },
  },
  getters: {
    streamCount: (state) => state.activeStreams.length,
    gridClass: (state) => {
      switch (state.activeStreams.length) {
        case 1: return 'grid-one'
        case 2: return 'grid-two'
        case 3: return 'grid-three'
        case 4: return 'grid-four'
        default: return ''
      }
    },
  },
})