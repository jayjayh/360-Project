#include <iostream>

using namespace std;

int m=0,mx=0,tmp=0,count = 1;

void start(){
	
	cout << "Enter number." << endl;
	cin >> m;
	mx = m;
	cout << m << " " << mx << endl;
	
}

void repeat(){
	
	cout << "Enter Number." << endl;
	cin >> tmp;
	if(tmp > mx)
		mx = tmp;
	if(m > tmp)
		m = tmp;
	count++;
	cout << m << " " << mx << endl;
	
	
}

int main(){

	start();
	while(count < 9)
		repeat();
	return 0;

}