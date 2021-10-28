<template>
  <div
    class="modal"
    v-bind:class="{ 'is-active': modalIsActive }"
    v-on:keyup.esc="modalClose()"
  >
    <div class="modal-background"></div>
    <div class="modal-card" id="connection-modal-content">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Connection properties: {{ connection.name }}
        </p>
        <button
          qa-data="connection-modal-close"
          class="delete"
          aria-label="close"
          @click="modalClose"
        ></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name*</label>
          <div class="control">
            <input
              qa-data="connection-dialog-name"
              v-model="connection.name"
              class="input"
              type="text"
              v-bind:class="{ 'is-danger': fieldIsValid('name') !== '' }"
              placeholder="Connection name"
            />
          </div>
          <p
            id="connection-dialog-name-error"
            qa-data="connection-dialog-name-error"
            class="help is-danger"
          >
            {{ fieldIsValid("name") }}
          </p>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input
                qa-data="connection-dialog-enabled"
                type="checkbox"
                v-model="connection.enabled"
              />
              Enabled
            </label>
          </div>
        </div>
        <div class="field">
          <label class="label">Host*</label>
          <div class="control">
            <input
              qa-data="connection-dialog-host"
              v-model="connection.host"
              class="input"
              type="text"
              v-bind:class="{ 'is-danger': fieldIsValid('host') !== '' }"
              placeholder="Server endpoint"
            />
          </div>
          <p
            id="connection-dialog-host-error"
            qa-data="connection-dialog-host-error"
            class="help is-danger"
          >
            {{ fieldIsValid("host") }}
          </p>
        </div>
        <div class="field">
          <label class="label">Database*</label>
          <div class="control">
            <input
              qa-data="connection-dialog-database"
              v-model="connection.database"
              class="input"
              type="text"
              v-bind:class="{ 'is-danger': fieldIsValid('database') !== '' }"
              placeholder="Database name"
            />
          </div>
          <p
            id="connection-dialog-host-error"
            qa-data="connection-dialog-database-error"
            class="help is-danger"
          >
            {{ fieldIsValid("database") }}
          </p>
        </div>
        <div class="field">
          <label class="label">Port*</label>
          <div class="control">
            <input
              qa-data="connection-dialog-port"
              v-model.number="connection.port"
              class="input"
              type="text"
              v-bind:class="{ 'is-danger': fieldIsValid('port') !== '' }"
              placeholder="Connection port"
            />
          </div>
          <p
            id="connection-dialog-port-error"
            qa-data="connection-dialog-port-error"
            class="help is-danger"
          >
            {{ fieldIsValid("port") }}
          </p>
        </div>
        <div class="field">
          <label class="label">Login</label>
          <div class="control">
            <input
              qa-data="connection-dialog-login"
              v-model="connection.login"
              class="input"
              type="text"
              v-bind:class="{ 'is-danger': fieldIsValid('login') !== '' }"
              placeholder="Login for database connection"
            />
          </div>
          <p
            id="connection-dialog-login-error"
            qa-data="connection-dialog-login-error"
            class="help is-danger"
          >
            {{ fieldIsValid("login") }}
          </p>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input
              qa-data="connection-dialog-password"
              v-model="connection.password"
              class="input"
              type="password"
              v-bind:class="{ 'is-danger': fieldIsValid('password') !== '' }"
              placeholder="Password for database connection"
            />
          </div>
          <p
            id="connection-dialog-password-error"
            qa-data="connection-dialog-password-error"
            class="help is-danger"
          >
            {{ fieldIsValid("password") }}
          </p>
        </div>
        <div class="field">
          <label class="label">Type*</label>
          <div class="control">
            <div class="select">
              <select qa-data="connection-dialog-type" v-model="connectionType">
                <option value="postgresql">PostgreSQL</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot buttons is-right">
        <button
          v-if="!isNew"
          qa-data="connection-dialog-save"
          class="button is-link"
          @click="save"
          v-bind:class="{ 'is-static': !formIsValid }"
          title="Save connection changes"
        >
          Save changes
        </button>
        <button
          v-if="isNew"
          qa-data="connection-dialog-create"
          class="button is-success"
          @click="create"
          v-bind:class="{ 'is-static': !formIsValid }"
          title="Create connection"
        >
          Create connection
        </button>
        <button
          @click="modalClose"
          qa-data="connection-dialog-close"
          class="button"
        >
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import validate from "validate.js";

import axios from "axios";
import { EventBus } from "../utils.js";

import constraints from "./connection-validation.js";
import connection_template from "./connection-template.js";
import utils from "../utils.js";
import config from "../config.js";

export default {
  data() {
    return {
      connectionRecord: {},
      isNew: null,
      apiUrl: `${config.apiUrl}/connections`,
    };
  },
  async beforeMount() {
    try {
      let dialogRecord;
      if (this.id === "create") {
        dialogRecord = JSON.parse(
          JSON.stringify(connection_template.newConnection)
        );
        this.modalShow(dialogRecord, true);
      } else {
        dialogRecord = await axios.get(`${this.apiUrl}/${this.id}`);
        this.modalShow(dialogRecord.data);
      }
    } catch (error) {
      EventBus.$emit("app-error", utils.parceApiError(error));
    }
  },
  props: ["id"],
  methods: {
    modalShow(connection, isNew = false) {
      this.$set(this, "isNew", isNew);
      this.$set(this, "connectionRecord", connection);
    },
    async save() {
      try {
        const response = await axios.patch(
          `${config.apiUrl}/connections/${this.connectionRecord.id}`,
          this.connectionRecord.connection
        );
        if (response.status === 200) this.modalClose();
      } catch (error) {
        EventBus.$emit("app-error", utils.parceApiError(error));
      }
    },
    async create() {
      try {
        const response = await axios.post(
          `${config.apiUrl}/connections`,
          this.connectionRecord.connection
        );
        if (response.status === 201) this.modalClose();
      } catch (error) {
        EventBus.$emit("app-error", utils.parceApiError(error));
      }
    },
    modalClose: function () {
      try {
        this.$set(this, "connectionRecord", {});
      } finally {
        this.$router.push("/connections/");
      }
    },
    fieldIsValid(field) {
      const result = validate(this.connection, constraints("en"));
      if (result && result.hasOwnProperty(field)) return result[field][0];
      else return "";
    },
    isNumber: utils.isNumber,
  },
  computed: {
    modalIsActive: function () {
      return this.connection.name !== undefined;
    },
    connection: function () {
      return this.connectionRecord.connection !== undefined
        ? this.connectionRecord.connection
        : {};
    },
    formIsValid() {
      return validate(this.connection, constraints("en")) === undefined;
    },
    connectionType: {
      set(value) {
        switch (value) {
          case "postgresql":
            if (this.connection.port == "") this.connection.port = 5432;
            break;
          case "mongodb":
            if (this.connection.port == "") this.connection.port = 27017;
            break;
        }
        this.connection.type = value;
      },
      get() {
        return this.connection.type;
      },
    },
  },
  components: {},
};
</script>

<style lang="scss">
#connection-modal-content {
  width: 700px;
}
</style>
