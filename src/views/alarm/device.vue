<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="form" label-width="80px" label-suffix=":">
        <div class="flex-center-between">
          <el-form-item label="" label-width="0" class="flex1 margin-right10">
            <el-input
              v-model="form.keyword"
              :placeholder="keyWordPlaceHolder"
            />
          </el-form-item>
          <el-form-item label="" label-width="0">
            <el-button
              :icon="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              @click="isOpen = !isOpen"
            />
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button
              :disabled="multipleSelection.length <= 0"
              @click="handleDelete"
            >删除</el-button>
            <el-button
              class="margin-right10"
              @click="handleExport"
            >导出</el-button>
            <el-popover trigger="click">
              <el-checkbox-group
                v-model="checkedTableColumnList"
                class="flex-column"
              >
                <el-checkbox
                  v-for="col in tableColumnList"
                  :key="col.label"
                  :label="col.label"
                  :disabled="col.label === '序号'"
                >{{ col.label }}</el-checkbox>>
              </el-checkbox-group>
              <el-button slot="reference" icon="el-icon-s-tools" />
            </el-popover>
          </el-form-item>
        </div>
        <div v-show="isOpen" class="flex-center-start expandDiv">
          <el-form-item label="告警时间">
            <el-date-picker
              v-model="form.date"
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="告警级别">
            <el-select v-model="form.level" placeholder="请选择--">
              <el-option label="低" value="低" />
              <el-option label="中" value="中" />
              <el-option label="高" value="高" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="告警来源">
            <el-select v-model="form.source" placeholder="请选择--">
              <el-option label="来源1" value="来源1" />
              <el-option label="来源2" value="来源2" />
              <el-option label="来源3" value="来源3" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="告警类型">
            <el-select v-model="form.type" placeholder="请选择--">
              <el-option
                v-for="(item, index) in alarmTypeOption"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="权属单位">
            <el-input v-model="form.unit" />
            <!-- <el-select v-model="form.unit" placeholder="请选择--">
              <el-option label="集团本部" value="集团本部" />
              <el-option label="光大银行" value="光大银行" />
              <el-option label="光大证券" value="光大证券" />
              <el-option label="光大保险" value="光大保险" />
              <el-option label="光大信托" value="光大信托" />
            </el-select> -->
          </el-form-item>
          <el-form-item label="受害IP">
            <el-input v-model="form.sufferIp" />
          </el-form-item>
          <el-form-item label="攻击IP">
            <el-input v-model="form.attackIp" />
          </el-form-item>
          <!-- <el-form-item label="告警设备">
            <el-select v-model="form.device" placeholder="请选择--">
              <el-option
                v-for="(item, index) in deviceOption"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item> -->
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
        style="width: 100%"
        empty-text="无告警数据"
        stripe
        :header-cell-style="{ backgroundColor: '#eceff3', color: '#606266' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="55" label="序号" />
        <el-table-column
          v-for="col in tableColumnShowList"
          :key="col.id"
          :label="col.label"
          :prop="col.id"
          :sortable="col.sortable"
          :width="col.width"
        >
          <template slot-scope="{ row }">
            <div v-if="col.id == 'attackResult'">
              {{ row[col.id] == 0 ? "失败" : "成功" }}
            </div>
            <div v-else-if="col.id == 'isBanned'">
              {{ row[col.id] == 0 ? "否" : "是" }}
            </div>
            <div v-else-if="col.id == 'isBlocked'">
              {{ row[col.id] == 0 ? "否" : "是" }}
            </div>

            <span v-else>{{ row[col.id] ? row[col.id] : "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="deleteRow(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.length > 0"
        class="margin-top10 text-right"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getAlarmType,
  getAlarmDevice,
  getAlarmList,
  deleteAlarm,
  exportAlarm,
} from "@/api/alarm";
export default {
  name: "Alarm",
  components: {},
  directives: {},
  data() {
    return {
      isOpen: false,
      keyWordPlaceHolder:
        '输入高级表达式，例如:attack_sip="1.1.1.1" AND (threat_type IN ("APT事件","端口扫描") OR threat_name LIKE("暴力破解","弱口令"))',
      form: {
        keyword: "",
        date: [],
        level: "",
        type: "",
        unit: "",
        sufferIp: "",
        attackIp: "",
        device: "",
      },
      alarmTypeOption: [],
      deviceOption: [],
      tableData: [],
      tableColumnList: [
        {
          id: "time",
          label: "发生告警时间",
        },
        {
          id: "institutionShort",
          label: "权属单位",
        },
        {
          id: "sourceIp",
          label: "源ip",
        },
        {
          id: "sourcePort",
          label: "源端口",
        },
        {
          id: "city",
          label: "源ip城市",
        },
        {
          id: "country",
          label: "源ip国家",
        },
        {
          id: "destinationIp",
          label: "目的ip",
        },
        {
          id: "destinationPort",
          label: "目的端口",
        },
        {
          id: "destinationCity",
          label: "目的ip城市",
        },
        {
          id: "destinationCountry",
          label: "目的ip国家",
        },
        {
          id: "protocol",
          label: "协议类型",
        },
        {
          id: "targetSystem",
          label: "关联业务",
        },
        {
          id: "attackTypeSub",
          label: "告警类型",
        },
        {
          id: "attackLevel",
          label: "告警级别",
        },
        {
          id: "attackType_name",
          label: "威胁名称",
        },
        {
          id: "attackDetail",
          label: "告警详情",
        },
        {
          id: "attackResult",
          label: "攻击结果",
        },
        {
          id: "xff",
          label: "xff代理",
        },
        {
          id: "attackNum",
          label: "攻击次数",
        },
        {
          id: "deviceType",
          label: "告警设备",
        },
        {
          id: "deviceId",
          label: "设备id",
        },
        {
          id: "isBanned",
          label: "是否阻断",
        },
        {
          id: "isBlocked",
          label: "是否禁用",
        },
      ],
      pageNo: 1,
      pageSize: 20,
      total: 0,
      tableLoading: false,
      checkedTableColumnList: [
        "序号",
        "发生告警时间",
        "权属单位",
        "源ip",
        "目的ip",
        "关联业务",
        "告警类型",
        "告警级别",
        "告警详情",
        "攻击结果",
        "告警设备",
      ],
      multipleSelection: [],
    };
  },
  computed: {
    tableColumnShowList() {
      const list = [];
      this.tableColumnList.map((el) => {
        if (this.checkedTableColumnList.includes(el.label) > 0) {
          list.push(el);
        }
      });
      return list;
    },
  },
  created() {
    this.getAlarmType();
    this.form.device = this.$route.meta.title ? this.$route.meta.title : null
    this.getList();
  },
  methods: {
    getAlarmType() {
      getAlarmType()
        .then((res) => {
          this.alarmTypeOption = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAlarmDevice() {
      getAlarmDevice()
        .then((res) => {
          this.deviceOption = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getList() {
      this.tableLoading = true;
      getAlarmList({
        statement: this.form.keyword ? this.form.keyword : null, // 自定义查询条件
        startTime: this.form.date?.[0] ? this.form.date?.[0] : null, // 查询范围起始时间
        endTime: this.form.date?.[1] ? this.form.date?.[1] : null, // 查询范围截止时间
        attackLevel: this.form.level ? this.form.level : null, // 告警级别 目前暂定为低中高三级
        attackTypeSub: this.form.type ? this.form.type : null, // 告警类型
        sourceIp: this.form.attackIp ? this.form.attackIp : null, // 攻击源ip
        targetIp: this.form.sufferIp ? this.form.sufferIp : null, // 受害ip
        deviceType: this.form.device ? this.form.device : null, // 告警设备
        company: this.form.unit ? this.form.unit : null, // 权属单位
        pageIndex: this.pageNo,
        pageSize: this.pageSize,
      })
        .then((res) => {
          this.tableData = res.logList;
          this.total = res.count;
          this.tableLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList();
    },
    deleteRow(row) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAlarm({
          ids: row.id,
        })
          .then((res) => {
            this.$message.success("删除成功");
            this.getList();
          })
          .catch((err) => {
            console.log(err);
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleDelete() {
      this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const arr = [];
        this.multipleSelection.map((el) => {
          arr.push(el.id);
        });
        deleteAlarm({
          ids: `${arr}`,
        })
          .then((res) => {
            this.$message.success("删除成功");
            this.getList();
          })
          .catch((err) => {
            console.log(err);
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    resetForm() {
      this.form = {
        keyword: "",
        time: [],
        level: "",
        source: "",
        type: "",
        unit: "",
        sufferIp: "",
        attackIp: "",
      };
    },

    onSubmit() {
      this.getList();
    },
    handleExport() {
      exportAlarm({
        statement: this.form.keyword ? this.form.keyword : null, // 自定义查询条件
        startTime: this.form.date?.[0] ? this.form.date?.[0] : null, // 查询范围起始时间
        endTime: this.form.date?.[1] ? this.form.date?.[1] : null, // 查询范围截止时间
        attackLevel: this.form.level ? this.form.level : null, // 告警级别 目前暂定为低中高三级
        attackTypeSub: this.form.type ? this.form.type : null, // 告警类型
        sourceIp: this.form.attackIp ? this.form.attackIp : null, // 攻击源ip
        targetIp: this.form.sufferIp ? this.form.sufferIp : null, // 受害ip
        deviceType: this.form.device ? this.form.device : null, // 告警设备
        company: this.form.unit ? this.form.unit : null, // 权属单位
      })
        .then((res) => {
          const data = new Blob([res], {
            type: "currentProject/vnd.ms-excel;charset=utf-8",
          });
          const dowmloadUrl = window.URL.createObjectURL(data);
          const link = document.createElement("a");
          link.href = dowmloadUrl;
          link.download = `集团_${this.form.device}告警日志导出表.xlsx`;
          link.click();
          link.remove();
          window.URL.revokeObjectURL(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.expandDiv {
  background: rgb(236, 239, 243);
  padding: 10px;
  border-radius: 4px;
}
</style>
