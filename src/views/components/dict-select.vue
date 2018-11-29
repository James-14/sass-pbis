<template>
  <el-form-item v-bind="$attrs" v-on="$listeners">
      <el-select v-bind:value="value" v-on:change="$emit('change',$event)" :placeholder="placeholder">
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
      placeholder: {
        type: String,
        default: '字典项'
      },
      dictCode: {
        type: String
      },
      value:Number
    },
    inheritAttrs: false,
    data () {
      return {
        dictValue: '',
        itemList: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // setValue(value){
        // console.log(this.itemList)
        // this.dictValue = value
      // },
      fetchData(){        
        this.$http({
          url: this.$http.adornUrl('/sys/dictItem/listNP'),
          method: 'post',
          params: this.$http.adornParams({            
            'dictCode': this.dictCode
          })
        }).then(({data}) => {
          if (data && data.list) {            
            this.itemList = data.list
          } else {
            this.itemList = []
          }
        })        
      // },
      // getValue(value){
        //this.$emit('selectFunc', this.dictValue)
      }
    }
  }
</script>