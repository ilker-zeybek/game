const app = {
  mounted: function () {
    window.setInterval(() => {
      this.refresh_list();
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

        let response = await fetch(
          `http://localhost:8000/ready?name=${this.name}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        this.player_ready = true;
        this.name = null;
      } else {
        this.message = 'This name exists.';
      }
    },
    async refresh_list() {
      let response = await fetch(`http://localhost:8000/ready/list`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      response = await response.json();
      this.ready_list = Object.values(response.data);
    },
  },
};

Vue.createApp(app).mount('#app');
