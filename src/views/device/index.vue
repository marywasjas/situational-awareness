<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="onAdd">新增</el-button>
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
        empty-text="无设备数据"
        stripe
        :header-cell-style="{ backgroundColor: '#eceff3', color: '#606266' }"
      >
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
            <div v-if="col.id == 'isShow'">
              {{ row[col.id] == 1 ? "显示" : "隐藏" }}
            </div>
            <span v-else>{{ row[col.id] ? row[col.id] : "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="updateRow(row)">
              更新
            </el-button>
            <el-button type="text" size="small" @click="deleteRow(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增设备 -->
    <el-dialog
      title="新增设备"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="addForm" :model="form" label-width="160px" :rules="formRule">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name" placeholder="请填写设备名称" :disabled="currentObj.deviceId" />
        </el-form-item>
        <el-form-item label="设备描述" prop="desc">
          <el-input
            v-model="form.desc"
            type="textarea"
            :rows="2"
            placeholder="请输入设备描述"
          />
        </el-form-item>
        <el-form-item label="是否显示在侧边栏" prop="show">
          <el-switch v-model="form.show" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handelAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAlarmDeviceAll, deleteAlarmDevice,
  addAlarmDevice,
  updateAlarmDevice
} from "@/api/alarm";
export default {
  name: "Alarm",
  components: {},
  directives: {},
  data() {
    return {
      device: "",
      form: {
        name: '',
        desc: '',
        show: true
      },
      currentObj: {},
      dialogLoading: false,
      formRule: {
        name: [
          { required: true, message: '请输入设备名称', trigger: ['change', 'blur'] },
        ],
        desc: [
          { required: true, message: '请输入设备描述', trigger: ['change', 'blur'] },
        ],
        show: [
          { required: true, message: '请选择是否显示在侧边栏', trigger: ['change'] },
        ],
      },
      tableData: [],
      tableColumnShowList: [
        {
          id: "deviceName",
          label: "设备名称",
        },
        {
          id: "deviceDesc",
          label: "设备描述",
        },
        {
          id: "isShow",
          label: "是否展示",
        },
      ],
      tableLoading: false,
      dialogFormVisible: false
    };
  },
  computed: {
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      getAlarmDeviceAll()
        .then((res) => {
          this.tableData = res;
          this.tableLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteRow(row) {
      this.$confirm('此操作将删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAlarmDevice({
          id: row.deviceId,
        })
          .then((res) => {
            this.$message.success("删除成功");
            this.getList();
            location.reload();
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
    updateRow(row) {
      this.dialogFormVisible = true
      this.currentObj = JSON.parse(JSON.stringify(row))
      this.form = {
        name: this.currentObj.deviceName,
        desc: this.currentObj.deviceDesc,
        show: this.currentObj.isShow === '1'
      }
    },
    onAdd() {
      this.dialogFormVisible = true
      this.currentObj = {}
      this.form = {
        name: '',
        desc: '',
        show: true
      }
    },
    handelAdd() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.currentObj.deviceId) {
            this.dialogLoading = true
            updateAlarmDevice({
              deviceId: this.currentObj.deviceId,
              deviceName: this.form.name,
              deviceDesc: this.form.desc,
              isShow: this.form.show ? '1' : '0'
            }).then(res => {
              this.dialogLoading = false
              this.dialogFormVisible = false
              this.$message.success("新增成功");
              location.reload();
              this.getList()
            }).catch(err => {
              this.dialogLoading = false
              this.dialogFormVisible = false
              console.log(err)
            })
          } else {
            this.dialogLoading = true
            addAlarmDevice({
              deviceName: this.form.name,
              deviceDesc: this.form.desc,
              isShow: this.form.show ? '1' : '0'
            }).then(res => {
              this.dialogLoading = false
              this.dialogFormVisible = false
              this.$message.success("新增成功");
              location.reload();
              this.getList()
            }).catch(err => {
              this.dialogLoading = false
              this.dialogFormVisible = false
              console.log(err)
            })
          }
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
