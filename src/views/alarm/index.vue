<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        label-suffix=":"
      >
        <div class="flex-center-between">
          <el-form-item
            label=""
            label-width="0"
            class="flex1 margin-right10"
          >
            <el-input
              v-model="form.keyword"
              :placeholder="keyWordPlaceHolder"
            />
          </el-form-item>
          <el-form-item
            label=""
            label-width="0"
          >
            <el-button :icon="isOpen?'el-icon-arrow-up':'el-icon-arrow-down'" @click="isOpen = !isOpen" />
            <el-button
              type="primary"
              @click="onSubmit"
            >搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button :disabled="multipleSelection.length<=0">删除</el-button>
            <el-button class="margin-right10" :disabled="multipleSelection.length<=0">导出</el-button>
            <el-popover trigger="click">
              <el-checkbox-group v-model="checkedTableColumnList" class="flex-column">
                <el-checkbox v-for="col in tableColumnList" :key="col.label" :label="col.label" :disabled="col.label==='序号'">{{ col.label }}</el-checkbox>>
              </el-checkbox-group>
              <el-button slot="reference" icon="el-icon-s-tools" />
            </el-popover>
          </el-form-item>
        </div>
        <div v-show="isOpen" class="flex-center-start expandDiv">
          <el-form-item label="告警时间">
            <el-date-picker
              v-model="form.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="告警级别">
            <el-select
              v-model="form.level"
              placeholder="请选择--"
            >
              <el-option
                label="低"
                value="低"
              />
              <el-option
                label="中"
                value="中"
              />
              <el-option
                label="高"
                value="高"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="告警来源">
            <el-select
              v-model="form.source"
              placeholder="请选择--"
            >
              <el-option
                label="来源1"
                value="来源1"
              />
              <el-option
                label="来源2"
                value="来源2"
              />
              <el-option
                label="来源3"
                value="来源3"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="告警类型">
            <el-select
              v-model="form.type"
              placeholder="请选择--"
            >
              <el-option
                label="类型1"
                value="类型1"
              />
              <el-option
                label="类型2"
                value="类型2"
              />
              <el-option
                label="类型3"
                value="类型3"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="权属单位">
            <el-select
              v-model="form.unit"
              placeholder="请选择--"
            >
              <el-option
                label="集团本部"
                value="集团本部"
              />
              <el-option
                label="光大银行"
                value="光大银行"
              />
              <el-option
                label="光大证券"
                value="光大证券"
              />
              <el-option
                label="光大保险"
                value="光大保险"
              />
              <el-option
                label="光大信托"
                value="光大信托"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="受害IP">
            <el-input v-model="form.sufferIp" />
          </el-form-item>
          <el-form-item label="攻击IP">
            <el-input v-model="form.attackIp" />
          </el-form-item>
          <!-- <el-form-item label="威胁级别">
            <el-select
              v-model="form.threaten"
              placeholder="请选择--"
            >
              <el-option
                label="危急"
                value="危急"
              />
              <el-option
                label="高危"
                value="高危"
              />
              <el-option
                label="中危"
                value="中危"
              />
              <el-option
                label="低危"
                value="低危"
              />
            </el-select>
          </el-form-item> -->
        </div>
      </el-form>
    </div>
    <div
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    >
      <el-table
        key="id"
        :data="tableData"
        style="width: 100%;"
        empty-text="无告警数据"
        stripe
        :header-cell-style="{ backgroundColor: '#eceff3', color: '#606266' }"

        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          v-for="(col) in tableColumnShowList"
          :key="col.id"
          :label="col.label"
          :prop="col.id"
          :sortable="col.sortable"
          :width="col.width"
        >
          <template slot-scope="{row}">
            <span>{{ row[col.id] }}</span>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        v-if="tableData.length>0"
        class="margin-top10 text-right"
        :current-page="page.page"
        :page-sizes="[10, 20, 30, 40,50,100]"
        :page-size="page.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alarm',
  components: { },
  directives: { },
  data() {
    return {
      isOpen: false,
      keyWordPlaceHolder: '输入高级表达式，例如:attack_sip="1.1.1.1" AND (threat_type IN ("APT事件","端口扫描") OR threat_name LIKE("暴力破解","弱口令"))',
      form: {
        keyword: '',
        time: [],
        level: '',
        source: '',
        type: '',
        unit: '',
        sufferIp: '',
        attackIp: ''
      },
      tableData: [],
      tableColumnList: [
        {
          id: 'index',
          label: '序号'
        },
        {
          id: 'time',
          label: '发生告警时间'
        },
        {
          id: 'institution_short',
          label: '所属公司简称(权属单位)'
        },
        {
          id: 'source_ip',
          label: '源ip'
        },
        {
          id: 'source_port',
          label: '源端口'
        },
        {
          id: 'city',
          label: '源ip城市'
        },
        {
          id: 'country',
          label: '源ip国家'
        },
        {
          id: 'destination_ip',
          label: '目的ip'
        },
        {
          id: 'destination_port',
          label: '目的端口'
        },
        {
          id: 'destination_city',
          label: '目的ip城市'
        },
        {
          id: 'destination_country',
          label: '目的ip国家'
        },
        {
          id: 'protocol',
          label: '协议类型'
        },
        {
          id: 'target_system',
          label: '关联业务'
        },
        {
          id: 'attack_type_sub',
          label: '告警类型'
        },
        {
          id: 'attack_level',
          label: '攻击告警级别'
        },
        {
          id: 'attack_type_name',
          label: '威胁名称'
        },
        {
          id: 'attack_detail',
          label: '告警详情'
        },
        {
          id: 'attack_result',
          label: '攻击结果'
        },
        {
          id: 'xff',
          label: 'xff代理'
        },
        {
          id: 'attack_num',
          label: '攻击次数'
        },
        {
          id: 'device_type',
          label: '告警设备'
        },
        {
          id: 'device_id',
          label: '设备id'
        },
        {
          id: 'is_banned',
          label: '是否阻断'
        },
        {
          id: 'is_blocked',
          label: '是否禁用'
        }
      ],
      tableLoading: false,
      page: {
        page: 1,
        limit: 20,
        total: 0
      },
      multipleSelection: [],
      checkedTableColumnList: ['序号', '发生告警时间', '所属公司简称(权属单位)', '源ip', '目的ip', '关联业务', '告警类型', '攻击告警级别', '告警详情', '攻击结果', '告警设备']
    }
  },
  computed: {
    tableColumnShowList() {
      const list = []
      this.tableColumnList.map(el => {
        if (this.checkedTableColumnList.includes(el.label) > 0) {
          list.push(el)
        }
      })
      return list
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    resetForm() {
      this.form = {
        keyword: '',
        time: [],
        level: '',
        source: '',
        type: '',
        unit: '',
        sufferIp: '',
        attackIp: ''
      }
    },
    getList() {
      this.tableLoading = true
      this.tableData = [
        {
          index: 1,
          time: '2023/10/18 16:29:34'
        }
      ]
      this.page.total = 1
      this.tableLoading = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.expandDiv{
  background: rgb(236, 239, 243);
  padding: 10px;
  border-radius: 4px;
}
</style>
