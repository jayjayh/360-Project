var stack_start_address =  2000, text_start_address = 1000, memory_start_address = 500;
var keyboard_memory_start = 2000, keyboard_memory_end = 2100, display_memory_start = 2104, display_memory_end = 2204;
var register_name_64 = ["rbp", "rsp", "rip", "rax", "rbx" ,"rdi" ,"rsi" , "rdx", "rcx", "r8", "r9"];
var register_name_32 = ["ebp", "esp", "rip", "eax", "ebx" ,"edi" ,"esi" , "edx", "ecx", "r8d", "r9d"];
var registers = {
    "rbp": stack_start_address, "rsp": stack_start_address,
    "rip": 0, "rax": 0, "rbx": 0, "rdi": 0,
    "rsi": 0, "rdx": 0, "rcx": 0, "r8": 0, "r9": 0
}
var function_table = [];
var address_code_table = [];
var stack_table = [];
var memory_table = [];
var label_table = []
var rFlag = {"je":false,"jge":false,"jle":false,"jg":false, "jl":false,"jne":false}
var waiting_input = false;
var current_variable ="";
var recieved_input = false;
var label_number = 1;
