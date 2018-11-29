<template>
  <el-form-item v-bind="$attrs" v-on="$listeners">
    <el-select v-bind:value="value" :placeholder="placeholder" v-on:change="$emit('change',$event)" class="select-width">
      <el-option v-for="item in itemList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
    </el-select>
    <!-- <el-select v-model="cValue" :placeholder="placeholder" @change="getValue" class="select-width">
      <el-option v-for="item in itemList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
    </el-select> -->
  </el-form-item>
</template>

<script>
  export default {
    name: 'common-select',
    model:{
      prop:'value',
      event:'change'
    },
    props: {
      placeholder: {
        type: String
      },
      url:{
        type: String
      },
      qParam:{
        type:Object
      },
      value:Number
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
      // setValue(value){
        //this.cValue = value
      // },
      fetchData(){        
        this.$http({
          url: this.$http.adornUrl(this.url),
          method: 'post',
          params: this.$http.adornParams(this.qParam)
        }).then(({data}) => {
          if (data && data.list) {            
            this.itemList = data.list
          } else {
            this.itemList = []
          }
        })        
      // },
      // getValue(value){
        //this.$emit('selectFunc', this.cValue)
      }
    }
  }
</script>
