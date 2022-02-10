const app = {
  mounted: function () {
    window.setInterval(() => {
      this.refresh_list();
      this.start_check();
    }, 5000);
  },
  data() {
    return {
      name: null,
      ready_list: [],
      message: null,
      player_ready: false,
    };
  },
  methods: {
    async ready() {
      if (
        this.player_ready == false &&
        this.name != null &&
        !this.ready_list.includes(this.name)
      ) {
        this.ready_list.push(this.name);
        this.player_ready = true;
        let response = await fetch(
          `http://localhost:3000/ready?name=${this.name}`,
          {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        this.message = 'This name exists.';
      }
    },
    async refresh_list() {
      let response = await fetch(`http://localhost:3000/ready/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
      });
      response = await response.json();
      this.ready_list = Object.values(response.data);
    },
    async vote() {
      let response = await fetch(
        `http://localhost:3000/game/votetostart?name=${this.name}`,
        {
          method: 'GET',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
        }
      );
    },
    async start_check() {
      let response = await fetch(`http://localhost:3000/game/start`, {
        method: 'GET',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
      });
    },
  },
};

Vue.createApp(app).mount('#app');
