#include <iostream>

using namespace std;

void start(int &m,int &mx){

	cout << "Enter number." << endl;
	cin >> m;
	mx = m;
	cout << m << " " << mx << endl;

}

void repeat(int &m,int &mx){

	int tmp;
	cout << "Enter Number." << endl;
	cin >> tmp;
	if(tmp > mx)
		mx = tmp;
	if(m > tmp)
		m = tmp;
	cout << m << " " << mx << endl;


}

int main(){

	int m=0,mx=0,count = 0;
	start(m,mx);
	while(count < 9){

		repeat(m,mx);
		count++;

	}
	return 0;

}
