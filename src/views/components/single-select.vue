<template>
  <el-form-item>
    <el-select v-bind:value="value" key="singleSelect" v-on:change="$emit('change',$event)" :placeholder="placeholder">
      <el-option v-for="item in itemList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
  export default {
    name: 'dict-select',
    model:{
      prop:'value',
      event:'change'
    },
    props: {
      value:String,
      placeholder: {
        type: String,
        default: '字典项'
      }
    },
    inheritAttrs: false,
    data () {
      return {
        itemList: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(){        
        var item={label:'aaa',value:'11'}       
        var item2={label:'bbb',value:'22'}       
        var item3={label:'ccc',value:'33'}       
        this.itemList.push(item)
        this.itemList.push(item2)
        this.itemList.push(item3)
      }
    }
  }
</script>