<template>
  <v-container>
    <v-snackbar v-model="invalidLogin" :timeout="timeout" top>Invalid username and password</v-snackbar> 
    <v-snackbar v-model="regUser" :timeout="timeout" top>{{responseValues.message}}</v-snackbar>
    <v-snackbar v-model="value" :timeout="timeout" top>Logged Out</v-snackbar>
    <v-layout>
      <v-flex class="image">
          <v-img src="../assets/book.jpg" aspect-ratio="1" class="image" elevation="12"></v-img>
      </v-flex>
      <v-flex>
        <v-card width="450" height="650" elevation="12">
          <v-flex pl-5 pt-4>
            <v-flex pl-6 pt-3>
              <v-row>
                <v-col>
                  <v-btn class="button"
                    outlined
                    @click="enableLogin()"
                    rounded
                  >
                    <span>Login</span>
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn class="button"
                    outlined
                    @click="enableRegister()"
                    rounded
                  >
                    <span>Register</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-flex>
            <v-layout pt-5 v-if="login">
              <v-flex>
                <v-card width="400">
                  <v-flex width="300">
                    <v-col>
                      <v-form ref="form">
                        <v-text-field
                          v-model="logdetail.userName"
                          label="Username"
                          :rules="nameRules"
                          solo
                          dense
                        ></v-text-field>
                        <v-text-field
                          v-model="logdetail.password"
                          label="Password"
                          type="Password"
                          :rules="passwordRules"
                          solo
                          dense
                        ></v-text-field>
                      </v-form>
                    </v-col>
                  </v-flex>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout pt-5 v-else>
              <v-flex>
                <v-card width="400">
                  <v-flex>
                    <v-col>
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="register.firstName"
                            label="Firstname"
                            solo
                            dense
                          ></v-text-field>
                          <v-text-field
                            v-model="register.lastName"
                            label="Lastname"
                            solo
                            dense
                          ></v-text-field>
                          <v-text-field
                            v-model="register.userName"
                            label="Username"
                            solo
                            dense
                          ></v-text-field>
                          <v-text-field
                            v-model="register.dateOfBirth"
                            label="Date of birth"
                            v-bind="attrs"
                            v-on="on"
                            solo
                            dense
                          ></v-text-field>
                          <v-text-field
                            v-model="register.password"
                            label="Password"
                            type="password"
                            solo
                            dense
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="register.dateOfBirth"
                          @change="save"
                          no-title
                          scrollable
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-flex>
                </v-card>
              </v-flex>
            </v-layout>

            <v-layout pt-5 pr-6>
              <v-flex>
                <v-col>
                  <v-btn class="logbutton"
                    v-if="login"
                    block
                    outlined
                    @click="loginUser()"
                    >Login</v-btn
                  >
                  <v-btn v-else block outlined @click="registerUser()" class="logbutton"
                    >Sign Up</v-btn
                  >
                </v-col>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      timeout: 1000,
      login: true,
      responseValues: {},
      date: "",
      menu: false,
      dateEnable: false,
      logdetail: {
        userName: "",
        password: "",
      },
      nameRules: [(v) => !!v || "Name is required"],
      passwordRules: [
        (v) =>
          (v && v.length >= 8) || "Password must be greater than 8 characters",
      ],
      url: "http://127.0.01:8080",
      register: {
        userName: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        password: "",
      },
      value: false,
      regUser: false,
      validLogin: false,
      invalidLogin: false,
    };
  },
  methods: {
    enableLogin() {
      this.login = true;
    },
    enableRegister() {
      this.login = false;
    },
    save(date) {
      this.$refs.menu.save(date);
    },
    registerUser() {
      axios.post(this.url + "/register", this.register).then((response) => {
        this.responseValues = response.data;
        this.regUser = true;
        this.register = {}
      });
    },
    loginUser() {
      this.validate()
      axios.post(this.url + "/login", this.logdetail).then((response) => {
        this.responseValues = response.data;
      if (this.responseValues.status == "Success")  {
          this.validLogin= true
          this.$router.push({name:"dashboard_page", params: {values: this.responseValues.User}})
      } else {
          this.invalidLogin = true
      }
      });
    },
    validate() {
      this.$refs.form.validate();
    },
  },
  created() {
    this.value = this.$route.params.values;
  }
};
</script>
<style>
.image{
  height: 650px;
  width: 450px;
  left: 130px;
}
.logbutton{
  font-family: 'Consolas';
}
.button{
  font-family: 'Courier New';
}
</style>