// These EventListener manage the different actions of the crud.makeinsert
$("#add").on("click", addElement);
$("#update").on("click", updateElement);
$("#select-element").on("click", makeInsert);
$("#selAll").on("click", checkAll);

// vars which will be used.
let cont = 0;
let cont2 = 0;
let isSelected = false;

function checkAll() {
  cont2++;
  let $table = $(".tables");
  if (cont2 % 2 == 0) {
    $('input[type="checkbox"]:checked:not(#selAll)').prop("disabled", false);
    $table.bootstrapTable("uncheckAll");
  } else {
    $table.bootstrapTable("checkAll");
    $("#update").prop("disabled", true);
    $('input[type="checkbox"]:checked:not(#selAll)').prop("disabled", true);
  }
}

// Function that load the data on the webpage.
function main() {
  $(document).ready(function () {
    $("#update").prop("disabled", true);
    $("#delete").prop("disabled", true);

    let address = "../../Model/PHP/dataCollector.php";
    $.ajax({
      method: "GET",
      url: address,

      success: function (request) {
        collectDataObj(request);
      },
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    });

    let addressPlans = "../../Model/PHP/dataCollectorForPlans.php";
    $.ajax({
      method: "GET",
      url: addressPlans,

      success: function (request) {
        obtainPlanData(request);
      },
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    });
  });
}

function obtainPlanData(request) {
  let plans = JSON.parse(request);

  for (const plan of plans) {
    let option = $("<option>").append(plan.name);
    option.attr("value", plan.id_plan);
    $("#select-plan").append(option);
  }

  /*
    // ejemplos
    const obj = {age: 12, name: "foo", len: 20}
    [age, 12]
    [name, "foo"]
    // const name = obj.name
    // const age = obj.age
    // const len = obj.len
    
    // object destructuring
    const {name, age, len} = obj
    console.log(name)
    
    const [first] = [1,2,3]
    
    for (const [key, value] of Object.entries(obj)) {
        console.log(key, value)
    }
    /* end-ejemplos */
}

function checkProperties(row) {
  if (row.hasOwnProperty("id_objective")) {
    setactionsForObjectives(row);
  } else if (row.hasOwnProperty("id_plan")) {
    setactionsForPlans(row);
  } else {
    setactionsForIndicators(row);
  }
}

function setactionsForObjectives(row) {
  let checkboxNum = document.querySelectorAll(
    'input[type="checkbox"]:checked:not(#selAll)'
  );

  if (checkboxNum.length > 1) {
    $("#update").prop("disabled", true);
    $("#delete").prop("disabled", false);
    setupdateRowFromObjectives(row);
  } else if (checkboxNum.length === 0) {
    $("#update").prop("disabled", true);
    $("#delete").prop("disabled", true);
  } else {
    $("#update").prop("disabled", false);
    $("#delete").prop("disabled", false);
    setupdateRowFromObjectives(row);
    setupdateRowFromObjectives(row);
  }
}

function setactionsForIndicators(row) {
  let checkboxNum = document.querySelectorAll(
    'input[type="checkbox"]:checked:not(#selAll)'
  );

  if (checkboxNum.length > 1) {
    $("#update").prop("disabled", true);
    setdeleteRowFromIndicators(row);
  } else if (checkboxNum.length === 0) {
    $("#update").prop("disabled", true);
    $("#delete").prop("disabled", true);
  } else {
    $("#update").prop("disabled", false);
    $("#delete").prop("disabled", false);
    setupdateRowFromIndicators(row);
    setdeleteRowFromIndicators(row);
  }
}

function setactionsForPlans(row) {
  let checkboxNum = document.querySelectorAll(
    'input[type="checkbox"]:checked:not(#selAll)'
  );

  if (checkboxNum.length > 1) {
    $("#update").prop("disabled", true);
    setdeleteRowFromPlans(row);
  } else if (checkboxNum.length === 0) {
    $("#update").prop("disabled", true);
    $("#delete").prop("disabled", true);
  } else {
    $("#update").prop("disabled", false);
    $("#delete").prop("disabled", false);
    setupdateRowFromPlans(row);
    setdeleteRowFromPlans(row);
  }
}

function setupEvent(selector, func) {
  $(selector).on("click", func);
}

function setupdateRowFromObjectives(row) {
  const { id_objective } = row;
  setupEvent("#delete", function () {
    setdeleteObjectiveRow(id_objective);
  });
}

function setupdateRowFromObjectives(row) {
  setupEvent("#update", function () {
    updateObjectiveRow(row);
  });
}

function setdeleteRowFromPlans(row) {
  const { id_plan } = row;
  setupEvent("#delete", function () {
    deletePlanRow(id_plan);
  });
}

function setupdateRowFromPlans(row) {
  setupEvent("#update", function () {
    updatePlanRow(row);
  });
}

function setdeleteRowFromIndicators(row) {
  const { id_indicator } = row;
  setupEvent("#delete", function () {
    deleteIndicatorRow(id_indicator);
  });
}

function setupdateRowFromIndicators(row) {
  setupEvent("#update", function () {
    updateIndicatorRow(row);
  });
}

// Function that controls how many checkbox are checked.
setupEvent("#update", function () {
  let checkboxNum = document.querySelectorAll('input[type="checkbox"]:checked');

  isSelected =
    checkboxNum.length === 0 || checkboxNum.length > 1 ? false : true;
});

function setcheckAllcheckbox() {
  $("#table-targets").on("check-all.bs.table", function (e, rows) {
    for (const row of rows) {
      checkProperties(row);
    }
  });
}

function setuncheckAllcheckbox() {
  $("#table-targets").on("uncheck-all.bs.table", function (e, row) {
    $("#update").prop("disabled", true);
    $("#delete").prop("disabled", true);
  });
}

function setcheckRow() {
  $("#table-targets").on("check.bs.table", function (e, row, $element) {
    checkProperties(row);
  });
}

function setuncheckRow() {
  $("#table-targets").on("uncheck.bs.table", function (e, row, $element) {
    checkProperties(row);
  });
}

/* When you click on the plus icon twice that means you close the table, so this
    destroy the plans subtable */
function closeTable() {
  $(".detail-icon").on("click", function () {
    cont++;

    if (cont % 2 == 0) {
      $("#table-plans").bootstrapTable("destroy");
    }
  });
}

// Function that collects the plans data from the postgreSQL.
function collectDataObj(objectivesDataObject) {
  let objectives = JSON.parse(objectivesDataObject);

  for (const objective of objectives) {
    let option = $("<option>").append(objective.name);
    option.attr("value", objective.id_objective);
    $("#select-objective").append(option);
  }

  // Create the Bootstrap Table inserting the data obtained from the parsed JSON.
  $("#table-targets").bootstrapTable({
    data: objectives,
    detailFormatter: detailFormatter,
    columns: [
      {
        field: "name",
        title: "Objective Name",
      },
      {
        field: "code",
        title: "Code",
      },
      {
        field: "year",
        title: "Year",
      },
      {
        field: "notes",
        title: "Notes",
      },
      {
        field: "status",
        checkbox: true,
      },
    ],
    checkboxHeader: false,
  });

  setcheckAllcheckbox();

  setuncheckAllcheckbox();

  setcheckRow();

  setuncheckRow();

  closeTable();

  function detailFormatter(index, row, element) {
    let id = row.id_objective;
    let address = "../../Model/PHP/dataCollector2.php";

    $.ajax({
      method: "GET",
      url: address,
      data: { id },

      success: function (request) {
        collectDataPlans(request, id, element);
      },
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    });
  }
}

// Function for delete a row.
function setdeleteObjectiveRow(id) {
  let address = "../../Model/PHP/deleteRow.php";
  $.ajax({
    method: "POST",
    url: address,
    data: { id, table: "objectives", column: "id_objective" },

    success: function (request) {
      location.reload();
    },
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
  });
}

// Function that collects the objectives data from the postgreSQL.
function collectDataPlans(planDataObject, id, element) {
  $(element).html(
    $("#table-plans")
      .clone(false)
      .attr("id", "tbl_" + id)
      .show()
  );
  let plans = JSON.parse(planDataObject);

  // Create the Bootstrap Table inserting the data obtained from the parsed JSON.
  $("#tbl_" + id).bootstrapTable({
    data: plans,
    detailFormatter: detailFormatter,

    columns: [
      {
        field: "code",
        title: "Code",
      },
      {
        field: "name",
        title: "Plan Action Name",
      },
      {
        field: "description",
        title: "Description",
      },
      {
        field: "responsible",
        title: "Responsible",
      },
      {
        field: "corresponsible",
        title: "Corresponsible",
      },
      {
        field: "goal",
        title: "Goal",
      },
      {
        field: "estimation_date",
        title: "Estimation_date",
      },
      {
        field: "notes",
        title: "Notes",
      },
      {
        field: "status",
        checkbox: true,
      },
    ],
    checkboxHeader: false,
  });

  function detailFormatter(index, row, element) {
    let id = row.id_plan;
    let address = "../../Model/PHP/dataCollector3.php";

    $.ajax({
      method: "GET",
      url: address,
      data: { id },

      success: function (request) {
        collectDataIndicator(request, id, element);
      },
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    });
  }

  $("#table-plans").hide();
}

// Function for delete a row.
function deletePlanRow(id) {
  let address = "../../Model/PHP/deleteRow.php";
  $.ajax({
    method: "POST",
    url: address,
    data: { id, table: "plans", column: "id_plan" },

    success: function (request) {
      location.reload();
    },
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
  });
}

function collectDataIndicator(indicatorDataObject, id, element) {
  $(element).html(
    $("#table-indicator")
      .clone(false)
      .attr("id", "tbl_" + id)
      .show()
  );
  let indicators = JSON.parse(indicatorDataObject);

  // Create the Bootstrap Table inserting the data obtained from the parsed JSON.
  $("#tbl_" + id).bootstrapTable({
    data: indicators,

    columns: [
      {
        field: "tracking_date",
        title: "Date",
      },
      {
        field: "value",
        title: "Value",
      },
      {
        field: "status",
        checkbox: true,
      },
    ],
    checkboxHeader: false,
  });

  $("#table-indicator").hide();
}

function deleteIndicatorRow(id) {
  let address = "../../Model/PHP/deleteRow.php";
  $.ajax({
    method: "POST",
    url: address,
    data: { id, table: "indicator", column: "id_indicator" },

    success: function (request) {
      location.reload();
    },
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
  });
}

function cerrarModal() {
  $(".close").on("click", function () {
    $("#modal-insert").modal("hide");
    $("#modal-update").modal("hide");
  });
}

cerrarModal();

// Function for add a new row.
function addElement() {
  $("#modal-insert").modal("show");
  $("#modal-title-div").html("Inserting new Objective");
  $("#form-objective-insert").show();
  $("#form-plan-insert").hide();
  $("#form-indicator-insert").hide();
  $("#select-element").val("Objective");
}

function updateElement() {
  $("#modal-update").modal("show");
}

// Function for update a Plans row.
function updatePlanRow(row) {
  const {
    id_plan,
    code,
    name,
    description,
    responsible,
    corresponsible,
    goal,
    estimation_date,
    notes,
  } = row;

  if (isSelected) {
    $("#modal-title-div2").html("Update a Plan");
    $("#form-objective-update").hide();
    $("#form-indicator-update").hide();
    $("#form-plan-update").show();
    $("#select-element-update").hide();

    $("#ident-plan-update").val(id_plan);
    $("#code-plan-update").val(code);
    $("#name-plan-update").val(name);
    $("#desc-plan-update").val(description);
    $("#resp-plan-update").val(responsible);
    $("#corresp-plan-update").val(corresponsible);
    $("#goal-plan-update").val(goal);
    $("#estdate-plan-update").val(estimation_date);
    $("#notes-plan-update").val(notes);
    $("#select-plan").val("Plan");
  }
}

// Function for update an Objectives row.
function updateObjectiveRow(row) {
  const { id_objective, year, code, name, notes } = row;
  if (isSelected) {
    $("#modal-title-div2").html("Update an Objective");
    $("#form-plan-update").hide();
    $("#form-indicator-update").hide();
    $("#form-objective-update").show();
    $("#select-element-update").hide();

    $("#ident-objective-update").val(id_objective);
    $("#year-objective-update").val(year);
    $("#code-objective-update").val(code);
    $("#name-objective-update").val(name);
    $("#notes-objective-update").val(notes);
    $("#select-objective").val("Objective");
  }
}

// Function for update an Indicator row.
function updateIndicatorRow(row) {
  const { id_indicator, tracking_date, value } = row;
  if (isSelected) {
    $("#modal-title-div2").html("Update an Indicator");
    $("#form-objective-update").hide();
    $("#form-plan-update").hide();
    $("#form-indicator-update").show();
    $("#select-element-update").hide();

    $("#ident-indicator-update").val(id_indicator);
    $("#track-date-update").val(tracking_date);
    $("#value-update").val(value);
    $("#select-plan").val("Plan");
  }
}

// Function that controls which kind of data will be inserted.
function makeInsert() {
  let element = this.value;

  if (!element) {
    throw new Error("El valor Introducido no existe.");
  }

  switch (element) {
    case "Plan":
      addPlan();
      break;
    case "Objective":
      addObjective();
      break;
    case "Indicator":
      addIndicator();
      break;
  }
}

// Function that add the plan form inputs.
function addPlan() {
  $("#form-indicator-insert").hide();
  $("#form-objective-insert").hide();
  $("#modal-title-div").html("Inserting new Plan");
  $("#form-plan-insert").show();
}

// Function that add the objective form inputs.
function addObjective() {
  $("#form-indicator-insert").hide();
  $("#form-plan-insert").hide();
  $("#modal-title-div").html("Inserting new Objective");
  $("#form-objective-insert").show();
}

// Function that add the indicator form inputs.
function addIndicator() {
  $("#form-plan-insert").hide();
  $("#form-objective-insert").hide();
  $("#modal-title-div").html("Inserting new Indicator");
  $("#form-indicator-insert").show();
}

main();
