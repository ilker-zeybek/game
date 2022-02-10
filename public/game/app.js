const app = {
  mounted: function () {
    this.identify();
    this.select_question();
    setInterval(() => {
      this.check_answers();
    }, 5000);
  },
  data() {
    return {
      name: null,
      player_list: [],
      round_done: false,
      selected_question: 'Have you ever...',
      round: 0,
      player_done: false,
      results: [],
    };
  },
  methods: {
    async select_question() {
      let response = await fetch(`http://localhost:8000/game/question`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      response = await response.json();
      this.selected_question = response.selected_question;
    },
    async identify() {
      let response = await fetch(`http://localhost:8000/game/whoami`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      response = await response.json();
      this.name = response.name;
      this.player_list = Object.values(response.player_list);
    },
    async did() {
      let response = await fetch(
        `http://localhost:8000/game/did?name=${this.name}&question=${this.selected_question}&round=${this.round}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      this.player_done = true;
    },
    async didnt() {
      let response = await fetch(
        `http://localhost:8000/game/didnt?name=${this.name}&question=${this.selected_question}&round=${this.round}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      this.player_done = true;
    },
    async check_answers() {
      let response = await fetch(
        `http://localhost:8000/game/round&round=${this.round}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      response = await response.json();
      this.round_done = response.round_done;
      if (this.round_done) {
        this.round = this.round + 1;
        this.results = response.results;
        await new Promise((r) => setTimeout(r, 30000));
        this.select_question();
        this.round_done = false;
        this.player_done = false;
        this.results = [];
      }
    },
  },
};

Vue.createApp(app).mount('#app');
