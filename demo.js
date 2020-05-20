function highlightCurrentCode() {
    $("#code_"+registers["rip"]).css('background-color','#df9857');
}

function undoHighlightCurrentCode(){
   $("#code_"+registers["rip"]).css("background-color","");
}

var show_registers_64 = function(){
    for(var x=0; x < register_name_64.length; x++){
       $("#"+register_name_64[x]).html(registers[register_name_64[x]])
    }
}

var get_current_code = function(){
    for(var x = 0; x < address_code_table.length ; x++){
        if(address_code_table[x]["address"] ==  registers["rip"]){
            return address_code_table[x]["code"];
        }
    }
    return "";
}


/*
  The most important part!!!!
  1. Run each code line step by step.
  2. Here, you need to build functions to handle individual operation codes.
  3. In this demo, we have "mov", "sub", "push", "pop", "ret", "leave", "call".
*/
var execute = function(){
    if(address_code_table.length == 0){
        return false
    }
    var current_code = $.trim(get_current_code());
    if(current_code.length == 0){
        return false
    }
    undoHighlightCurrentCode();
    if(current_code.indexOf('mov') == 0){
        mov_handler(current_code);
        registers["rip"] -= 4;
    }else if(current_code.indexOf('sub') == 0){
        sub_handler(current_code);
        registers["rip"] -= 4;
    }else if(current_code.indexOf('add') == 0){
        add_handler(current_code);
        registers["rip"] -= 4;
    }else if(current_code.indexOf('push') == 0){
        push_handler(current_code);
        registers["rip"] -= 4;
    }else if(current_code.indexOf('pop') == 0){
        pop_handler(current_code);
        registers["rip"] -= 4;
    }else if(current_code.indexOf('ret') == 0){
        ret_handler(current_code);
    }else if(current_code.indexOf('leave') == 0){
        leave_handler(current_code);
        registers["rip"] -= 4;
    }else if(current_code.indexOf('call') == 0){
        function_handler(current_code);
	}else if(current_code.indexOf('jmp') == 0){
        jmp_handler(current_code);
	}else if(current_code.indexOf('inc') == 0){
        inc_handler(current_code);
		registers["rip"] -= 4;
	}else if(current_code.indexOf('dec') == 0){
        dec_handler(current_code);
		registers["rip"] -= 4;
	}else if(current_code.indexOf('cmp') == 0){
        cmp_handler(current_code);
		registers["rip"] -= 4;
	}else if(current_code.indexOf('je') == 0){
        je_handler(current_code);
	}else if(current_code.indexOf('jg') == 0){
        jg_handler(current_code);
	}else if(current_code.indexOf('jl') == 0){
        jl_handler(current_code);
	}else if(current_code.indexOf('jle') == 0){
        jle_handler(current_code);
	}else if(current_code.indexOf('jge') == 0){
        jge_handler(current_code);
	}else if(current_code.indexOf('jne') == 0){
        jne_handler(current_code);
	}else if(current_code.indexOf('lea') == 0){
        lea_handler(current_code);
		registers["rip"] -= 4;
    }else{
        registers["rip"] -= 4;
    }
    highlightCurrentCode();
    update_stack_table_view();
    show_registers_64();
    return true
}

/*
  initial the stack, the registers
  1.  Return address for "main" function is assumed to be 200.
  2.  The rbp of the function that calls the main function is assumed to be 3000.
  3.  The current stack/stack start address is assumed to be 2000.
  4.  The text section is started at 1000.
*/
var initial_stack_table_and_registers = function(){
	stack_table = [];
	stack_start_address =  2000;
	text_start_address = 1000;
	registers = {
        "rbp": 3000, "rsp": stack_start_address,
        "rip": 0, "rax": 0, "rbx": 0, "rdi": 0,
        "rsi": 0, "rdx": 0, "rcx": 0, "r8": 0, "r9": 0
	}
    update_stack_table_value(registers["rsp"], 200, 8);  // push return address for main function, assumed 200
    // registers["rsp"] -= 8;
    // update_stack_table_value(registers["rsp"], 3000, 8);  // push the rbp of the function that calls the main function, assumed 3000
}


/*
  initial the address system for all the code lines and create the function look-up table
  1. each function is assumed 4 bytes
  2. allocate each code line an address
  4. save function starting address and function name
  3. target the "main" function
*/
var initial_code_address = function(){
	address_code_table = [];
	function_table = [];
	label_table = [];
    $("#address_code_table").html("");
    var assemblyCode = document.getElementById('assemblyCode');
    var lines = assemblyCode.value.split("\n");
    var length = lines.length;
    for(var x = 0 ; x < length ; x++){
        address_code_table.push({
            "address": text_start_address,
            "code": lines[x]
        })
        if(lines[x].indexOf("main") == 0){   // for main function, set RIP register
            function_table.push({
                "label": lines[x].substring(0, lines[x].length - 1),
                "address": text_start_address
            })
            registers["rip"] = text_start_address;
        }
        if(lines[x].indexOf("start") == 0){     // for other functions, push into function table
            function_table.push({
                "label": lines[x].substring(0, lines[x].length - 1),
                "address": text_start_address
            })
        }
		if(lines[x].indexOf(".L") == 0){     // for other functions, push into function table
            label_table.push({
                "label": lines[x].substring(0, lines[x].length - 1),
                "address": text_start_address
            })
        }
    if(lines[x].indexOf(".S") == 0){     // for other functions, push into function table
            label_table.push({
                    "label": lines[x].substring(0, lines[x].length - 1),
                    "address": text_start_address
                })
    }
        $("#address_code_table").append("<tr id='code_" + text_start_address + "'><td>" + text_start_address + "</td><td>" + lines[x] + "</td></tr>");
        text_start_address -= 4;
    }
    $("#function_address_table").html("");
    for (var x = 0; x < function_table.length; x++) {
        $("#function_address_table").append("<tr><td>" + function_table[x]["label"] + "</td><td>" + function_table[x]["address"] + "</td></tr>")
    }
	$("#label_address_table").html("");
    for (var i = 0; i < label_table.length; i++) {
        $("#label_address_table").append("<tr><td>" + label_table[i]["label"] + "</td><td>" + label_table[i]["address"] + "</td></tr>")
    }
}

var update_memory = function(){

  memory_start_address = 500;
  //update_memory_stack();
  //update_memory_heap();
  //update_memory_bss();
  //update_memory_initialized_data();
  update_memory_text();

}

var update_memory_stack = function(){

  memory_table = [];
  $("#memory_stack_table").html("");
  $("#memory_stack_table").append("<tr id = 'stack'><td></td><td><b>Stack</b></td></tr>");

}

var update_memory_heap = function(){

  $("#heap_table").html("");
  $("#heap_table").append("<tr id = 'heap'><td></td><td><b>Heap</b></td></tr>");

}

var update_memory_bss = function(){

  $("#bss_table").html("");
  var text_code = document.getElementById('textEdit');
  var lines = textEdit.value.split("\n");
  var length = lines.length;
  $("#bss_table").append("<tr id = 'bss'><td></td><td><b>BSS</b></td></tr>");
  for(var x = 0; x < length; x++){

    //console.log(lines[x].indexOf("int"));
    if(lines[x].indexOf("{") >= 0){

      while(x < length && lines[x].indexOf("}") < 0 && lines[x].indexOf("static" < 0)){

        //console.log(x);
        x++;

      }

    }
    else if(lines[x].indexOf("()") >= 0){

      x++;

    }
    else if(lines[x].indexOf("int")>=0){

      var separate = lines[x].substring(lines[x].indexOf("int")+4,lines[x].length-1);
      //separate = separate.split(",");
      separate = separate.split(",");
      //console.log(separate);

      for(var i = 0; i < separate.length;i++){

        $("#bss_table").append("<tr id = 'bss_" + memory_start_address + "'><td>" + memory_start_address + "</td><td>" + separate[i].substring(0,separate[i].indexOf("=")) + "</td></tr>");
        memory_start_address--;

      }

    }

  }

}

var update_memory_initialized_data = function(){

  $("#initialized_data_table").html("");
  $("#initialized_data_table").append("<tr id = 'initialized_data'><td></td><td><b>Initialized Data</b></td></tr>");

}

var update_memory_text = function(){

  memory_table = [];
  $("#text_code_table").html("");
  var text_code = document.getElementById('textEdit');
  var lines = textEdit.value.split("\n");
  var length = lines.length;
  $("#text_code_table").append("<tr id = 'text'><td></td><td><b>Text</b></td></tr>");
  for(var x = 0; x < length; x++){

    if(lines[x] != ""){
      memory_table.push({

        "address" : memory_start_address,
        "instruction": lines[x]

      });
      $("#text_code_table").append("<tr id = 'text_" + memory_start_address + "'><td>" + memory_start_address + "</td><td>" + lines[x] + "</td></tr>");
      memory_start_address--;
    }

  }
  translate_to_assembly(memory_table,memory_table.length);
  //console.log(memory_table);

}

var update_source = function(){

  $("#text_code").html("<pre>"+document.getElementById("textEdit").value+"</pre>");

}

var get_input = function(){
    console.log("press");
  var input = document.getElementById("input_box").value;
  document.getElementById("input_box").value = "";
  input = parseInt(input,10);
  if(waiting_input && Number.isInteger(input)){

   // console.log(input);
    store_in_handler(input);
    waiting_input = false;
    recieved_input = true;
  }
}

var delete_space = function(data,length){

  var cutoff = 0;
  for(var x = 0;x < length; x++){

    while(data[x].instruction.substring(0,1) == "\t")
      data[x].instruction = data[x].instruction.substring(1);

  }

  return data;

}

var translate_to_assembly = function(data,length){

  var tab = "";
  get_constants(data,length);
  data = delete_space(data,length);
  for(var x = 0; x < length; x++){

    if(data[x].instruction.indexOf("void") == 0){

      $("#assemblyCode").append(data[x].instruction.substring(4) + ":\n\tpush    rbp\n\tmov     rbp,rsp\n");

    }
    else if(data[x].instruction.indexOf("int main") == 0){

      $("#assemblyCode").append(data[x].instruction.substring(3) + ":\n\tpush    rbp\n\tmov     rbp,rsp\n");

    }
    else if(data[x].instruction == "{"){

      tab = "\t";

    }
    else if(data[x].instruction == "}"){

      tab = "";

    }
    else if(data[x].instruction.indexOf("cout") == 0){

      $("#assemblyCode").append(tab + "out\n");
      //console.log("cout");

    }
    else if(data[x].instruction.indexOf("cin") == 0){

      $("#assemblyCode").append(tab + "in\n");

    }
    else if(data[x].instruction.indexOf("int") == 0){

      var variables = data[x].instruction.substring(3);
      variables = variables.split(',');
      variables[variables.length-1] = variables[variables.length-1].substring(0,variables[variables.length-1].length-1);

      for(var i = 0; i < variables.length; i++){

        $("#assemblyCode").append(tab + "push    " + variables[i].substring(variables[i].indexOf("=")+1) + "\n");

      }

    }
    else if(data[x].instruction.indexOf("while") == 0){

      $("#assemblyCode").append(".L"+label_number+":\n");
      label_number++;
      $("#assemblyCode").append(tab + "cmp     ");


    }

  }

}

var get_constants = function(data,length){

  var count = 1;
  for(var x = 0; x < length; x++){

    if(data[x].instruction.indexOf("\"") > 0){

      var str = get_string_from_code(data[x].instruction);
      $("#assemblyCode").append(".S" + count + ":\n");
      $("#assemblyCode").append("\t" + str + "\n");
      count++;

    }

  }

}

var get_string_from_code = function(line){

  var temp = line.indexOf('\"');
  return line.substring(temp,line.indexOf('\"',temp+1)+1);

}

/*
  load assembly codes into memory, do the following:
  1.  initial the stack, the registers
  2.  initial the address system for all the code lines and create the function look-up table, target the "main" function
  3.  set the RIP register to "main" function
*/
var load = function(){
    initial_stack_table_and_registers();
    initial_code_address();
    highlightCurrentCode();
    update_stack_table_view();
    show_registers_64();
    $("#assemblyCode").hide();
    $("#address_code").show();
}


/*
  show assembly editor
*/
var edit = function(){
	$("#assemblyCode").show();
  $("#address_code").hide();
}

var loadText = function(){

  update_memory();
  update_source();
	//initial_text_code();
	$("#textEdit").hide();
	$("#text_code").show();

}

var editText = function(){

	$("#textEdit").show();
	$("#text_code").hide();

}

/*
  document.ready is just like the main function in C/C++ and Java
*/
$( document ).ready(function() {
    show_registers_64(registers);
    /*
        run "execute" function when click on button "step"
    */
    $("#step").click(function() {
        execute();
    });
});
