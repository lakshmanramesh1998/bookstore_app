<template>
  <v-card>
    <v-snackbar v-model= "loggedIn" :timeout= "timeout" top>Welcome {{value.firstName}}</v-snackbar>
    <v-snackbar v-model= "bookRegistered" :timeout="timeout" top>{{responseValues.message}}</v-snackbar>
    <v-snackbar v-model= "bookDeleted" :timeout="timeout" top>{{deleteResponse.message}}</v-snackbar>
    <v-snackbar v-model= "changes" :timeout="timeout" top>{{selectedFile.message}}</v-snackbar>
    <v-snackbar v-model= "emptyOrder" :timeout="timeout" top>Please select some book</v-snackbar>
    <v-toolbar color="blue" flat dark>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-icon class="pr-2">mdi-account</v-icon>
      <v-toolbar-title class="title">{{ dashboardTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="logout blue white--text" outlined @click="logout()">
        <v-icon>mdi-logout</v-icon>
        Logout</v-btn
      >
      <template v-slot:extension>
        <v-tabs v-model="tab" grow>
          <v-tabs-slider color="white"></v-tabs-slider>
          <v-tab v-for="tabs in tabName" :key="tabs" class="tabTitles">{{ tabs }}</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-layout class="text-card">
          <!-- <v-card-text >Books</v-card-text> -->
          <v-text-field
            outlined
            solo
            dense
            v-model="search"
            style="left: -900px; width: 40%; padding-top: 10px"
            placeholder="Search"
            append-icon="mdi-magnify"
          >
          </v-text-field>
          <v-spacer></v-spacer>
          <v-btn v-if="admin"
            class="addButton purple white--text"
            @click="enableadd()"
          >
          <v-icon class="pr-2">mdi-book</v-icon>
            Add</v-btn
          >
          <v-btn v-else class="BuyNow" @click="placeOrder()">
            <img src="https://img.icons8.com/small/16/000000/checkout.png"/>
          Buy Now
          </v-btn>
          <v-btn class="saveButton blue white--text" v-if="admin" @click="saveChanges()">
            <v-icon class="pr-2">mdi-content-save</v-icon>Save
          </v-btn>
        </v-layout>
        <v-divider></v-divider>
        <v-container style="height:73vh"> 
          <v-data-table
            :headers="headers"
            :items="datalist"
            item-key="id"
            :search="search"
            class="elevation-3"
            hide-default-footer
          >
            <template v-slot:item="props"> 
              <tr v-if="admin">
                <td>
                  <v-avatar size="36">
                  <v-img :src="url+'/'+props.item.id">
                  </v-img>
                  </v-avatar>
                </td>
                <td class="tableData">{{props.item.title }}</td>
                <td class="tableData">{{props.item.authorName }}</td>
                <td class="tableData">{{props.item.description }}</td>
                <td class="tableData">$ {{props.item.price }}</td>
                <td class="tableData">
                  <v-btn fab x-small class="red white--text" @click="props.item.quantity++;changesDone(props.item)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  {{props.item.quantity}}
                  <v-btn fab x-small class="green white--text" @click="props.item.quantity--;changesDone(props.item)"
                  :disabled="props.item.quantity==0">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  </td>
                <td v-if="admin" class="tableData">
                  <v-btn v-model="props.item.remove" fab class="brown white--text" x-small outlined
                  @click="deleteBook(props.item)">
                    <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </td>
              </tr> 
              <tr v-else>
                <td>
                  <v-avatar size="36">
                  <v-img :src="url+'/'+props.item.id">
                  </v-img>
                  </v-avatar>
                </td>
                <td class="tableData">{{props.item.title}}</td>
                <td class="tableData">{{props.item.authorName}}</td>
                <td class="tableData">{{props.item.description}}</td>
                <td class="tableData">$ {{props.item.price}}</td>
                <td class="tableData">{{props.item.quantity}}</td>
                <td class="tableData">
                  <v-btn fab x-small @click=" props.item.noOfBooks++; props.item.quantity--;changesDone(props.item)"
                  :disabled="props.item.quantity==0" class="green white--text">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  {{props.item.noOfBooks}}
                  <v-btn fab x-small @click=" props.item.noOfBooks--;props.item.quantity++;changesDone(props.item)"
                  :disabled="props.item.noOfBooks==0" class="red white--text">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <v-container style="height:84vh">
          <v-row class="orderTable">
          <v-col>
          <span>Total Items: {{orderlist.length}}</span>
          </v-col>
          <v-col>
          <span>Total Cost:  ${{totalcost}}</span>
          </v-col>
          <!-- <v-col> -->
          <!-- </v-col>  -->
          </v-row>
          <v-data-table :headers="orderHeaders"
          :items="orderlist"
            item-key="id"
            :search="search"
            class="elevation-3"
            hide-default-footer
          >
          <template v-slot:item="props">
            <tr>
          <td class="tableData">{{props.item.id}}</td>
          <td class="tableData">{{props.item.userName}}</td>
          <td class="tableData">{{props.item.title}}</td>
          <td class="tableData">{{props.item.quantity}}</td>
          <td class="tableData">{{props.item.date}}</td>
            </tr>
          </template>
          </v-data-table>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="addBook" transition="dialog-top-transition" width="500">
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar align-center color="purple" dark
            >Add new Book
            <v-spacer></v-spacer>
            <v-btn text @click="dialog.value = false; book = {}"
              ><v-icon>mdi-close</v-icon>
            </v-btn></v-toolbar
          >
          <v-card-text class="pt-5"> 
            <v-row>
              <v-text-field
                placeholder="Title"
                v-model="book.title"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                placeholder="Author Name"
                v-model="book.authorName"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-textarea
                placeholder="Description"
                v-model="book.description"
              ></v-textarea>
            </v-row>
            <v-row>
              <v-text-field
                placeholder="Price"
                v-model="book.price"
              ></v-text-field>
            </v-row> 
            <v-row>
                <v-file-input label="Upload Image" v-model="book.image" @change="onImageUpload" prepend-icon=""></v-file-input>
            </v-row>
            <v-btn class="addbook purple white--text" @click="AddBook()"
              >Add Book</v-btn
            >
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      url: "http://127.0.0.1:8080",
      adminheaders: [
        {text:"Book", value:"id", class:"adminHeaders"},
        { text:"Title", value: "title", class: "adminHeaders" },
        { text:"Author", value: "authorName", class: "adminHeaders" },
        { text:"Description", value: "description", class: "adminHeaders" },
        { text:"Price", value: "price",class: "adminHeaders" },
        {text:"Quantity", value:"quantity", class: "adminHeaders"},
        {text:"Remove",value:"remove",class: "adminHeaders"}
      ],
      userheaders:[
        {text:"Book", value:"id", class:"userHeaders"},
        { text:"Title", value: "title", class: "userHeaders" },
        { text:"Author", value: "authorName", class: "userHeaders" },
        { text:"Description", value: "description", class: "userHeaders" },
        { text:"Price", value: "price", class: "userHeaders" },
        {text:"Available", value:"available", class: "userHeaders"},
        {text:"Quantity", value:"quantity", class: "userHeaders"},
      ],
      orderHeaders: [
        {text:"Order ID", value: "id", class:"orderHeaders"},
        {text:"Buyer Name", value:"userName", class:"orderHeaders"},
        {text:"Book Name", value:"title", class:"orderHeaders"},
        {text:"Quantity", value:"quantity", class:"orderHeaders"},
        {text:"Ordered on", value:"date", class:"orderHeaders"},
      ],
      rules: [
        value => !value || value.size < 8000000 || 'Avatar size should be less than 8 MB!',
      ],
      dashboardTitle: "",
      search:'',
      value: {},
      tab: null,
      selectedBooks:[],
      addBook: false,
      admin: false,
      timeout: 1000,
      loggedIn: true,
      loggedOut: true,
      book: {
        title: "",
        authorName: "",
        description: "",
        price: null,
        image: {},
        quantity:0
      },
      nullValues: true,
      bookRegistered: false,
      responseValues: {},
      selectedFile: {},
      booklist: {},
      datalist: [],
      newlist:[],
      orderlist: [],
      deleteResponse:{},
      totalcost: 0,
      bookDeleted: false,
      remove: false,
      changes: false,
      add: false,
      image:"",
      count: 0,
      emptyOrder: false,
      tabName: ["Inventory", "Orders"],
    };
  },
  methods: {
    logout() {
      this.$router.push({name: "login_page", params: {values: this.loggedOut}});
    },
    enableadd() {
      this.addBook = true;
    },
    listOrders() {
      var orderurl
      this.admin? orderurl = this.url+"/retrieve/orders/0" : orderurl = this.url+"/retrieve/orders/"+this.value.id;
     axios.get(orderurl).then(response =>{
       this.orderlist = response.data
       this.orderlist.forEach(data =>{
       this.totalcost+= data.price
     })
     })
    },
    onImageUpload(event){
    this.getBase64(event).then(
  data => {
    this.book.image = data
  }
)
    },
    getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
},
    AddBook() {
      if (
        this.book.title != "" &&
        this.book.authorName != "" &&
        this.book.price != null
      ) {
        axios.post(this.url + "/register/book", this.book).then((response) => {
          this.responseValues = response.data;
          this.bookRegistered = true;
          this.close();
        });
      }
    },
    close() {
      this.book = {};
      this.addBook = false;
      this.listBooks();
    },
    listBooks() {
      axios.get(this.url + "/books").then((response) => {
        this.booklist = response.data;
        this.datalist = response.data.books;
        this.datalist.forEach(data =>{
          if(this.admin){
        this.newlist.push(
        data,
        data.remove= true
        )
          } else {
            this.newlist.push(
        data
            )}
    })
      });
    },
    deleteBook(data) {
      axios.post(this.url+"/book/delete",data).then(response =>{
         this.deleteResponse = response.data;
         this.bookDeleted = true;
         this.listBooks()
      })
    },
    changesDone(item) {
      if(this.admin){
        var b1 = {}
        b1.id = item.id;
        b1.quantity = item.quantity;
        this.selectedBooks.push(b1)
      } else {
        var x = {}
        x.userID = this.value.id
        x.bookID = item.id
        x.price = parseInt(item.price,10)
        x.quantity = item.noOfBooks
        this.selectedBooks.push(x)
      }
    },
    saveChanges() {
      if(this.selectedBooks.length > 0) {
      axios.post(this.url+"/save/changes",this.selectedBooks).then(response =>{
        this.selectedFile = response.data;
        this.changes = true;
        this.listBooks()
      })
      }
    },
    placeOrder(){
      if(this.selectedBooks.length > 0) {
      axios.post(this.url+"/save/orders",this.selectedBooks).then(response =>{
        this.responseValues = response.data
        this.bookRegistered = true;
        this.listBooks();
        this.listOrders();
      })
    } else {
      this.emptyOrder = true;
    }
    }
  },
  created() {
    this.value = this.$route.params.values;
    if (this.value.userName == "admin") {
      this.admin = true;
    }
    this.admin
      ? (this.dashboardTitle = "Admin Dashboard")
      : (this.dashboardTitle = "User Dashboard");
    if (
      this.book.title == "" ||
      this.book.authorName == "" ||
      this.book.price == null
    ) {
      this.nullValues = true;
    }
    this.listBooks();
    this.listOrders();
  },
  computed: {
      headers() {
        return this.admin ? this.adminheaders : this.userheaders
      }
  }
};
</script>
<style>
.addbook {
  background-color: purple;
  color: white;
  left: 170px;
  margin-top: 20px;
}
.logout{
  font-family: 'Helvetica';
}
.text-card {
  padding-left: 80px;
  margin-left: 1000px;
  padding-top: 20px;
  font-size: large;
  font: bold;
  font-family: sans-serif;
  size: 10px;
}
.adminHeaders{
  background-color:#abdbe3;
  font-variant: small-caps;
}
.userHeaders{
  background-color: #679e96;
  font-variant: small-caps;
}
.orderHeaders {
  background-color: #6fd833;
  font-variant: small-caps;
}
.deleteButton{
  background-color: red;
}
.saveButton{
  font-family: "Lucida Console", "Courier New", monospace;
  right: 800px;
  top: 10px;
  padding: 10px;
}
.addbooktitle{
  font-family: 'advent font';
}
.addButton{
  font-family: "Lucida Console", "Courier New", monospace;
  right: 850px; 
  top: 10px; 
  width: 100px;
}
.tableData{
  font-family: 'Cormorant' ;
}
.tabTitles{
  font-family: "Lucida Console", "Courier New", monospace;
}
.BuyNow{
  top: 10px;
  right: 800px;
}
.searchBox{
 padding-right: 30px;
 width: 100px;
}
.orderTable {
  margin-left: 2px;
  width: 1160px;
  padding-top: 5px;
  padding-left: 5px;
  padding-bottom: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: larger;
  font-family: 'Times New Roman', Times, serif;
  border-style: double;
  /* border-color: blueviolet; */
  border-radius: 30px;
  background-color: #660066;
  color: aliceblue;
}
</style>