#引言

一开始接到实验室师姐的需求说项目组需要做一个标注系统，用来给印尼语那边的学生用来给数据做标注，当时想到反正手上也没有项目，就接下这个规模不大的显目来当练练手，后来发现虽然只是个小小的标注系统（真的是挺小的...），实际做起来，遇到的问题还是挺多，过程中学到了很多。所以写下这篇文章来记录这次项目开发
#关于1.0
####最初的需求
1. 从后台接收到一组待标注的词（印尼语）和这些词对应语境（印尼语）
2. 标注者标注这些词的类型（人民，地名，缩略词...）并且发送给后台
3. 每个标注者都需要登录才能进行标注
4. 能在页面显示标注者的标注总数
####最初技术选型
1. 当初接到这个项目的时候正好在学vue.js，加上想重温一下jquer0y，所以就选择了vue+jquery，是的...您没看错...我...用vue还用了jq。

![项目依赖.png](http://upload-images.jianshu.io/upload_images/6455799-739eaa9690e1416f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 在项目构造方面当时没有学webpack和node，所以vue-cli基本看不懂....又没有用上gulp，所以完全就是硬生生用script标签将几个模块链接起来，模板html还直接用了es6的 `` 来写...（现在看以前写的代码真的不忍直视）


![项目目录结构.png](http://upload-images.jianshu.io/upload_images/6455799-23a5fa2e9567433f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![vue-cli重构之后的目录结构](http://upload-images.jianshu.io/upload_images/6455799-94db6d67b760e2ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
####功能逻辑设计
1. 用对象sourceData来接收后台发送的数据，用对象editData来记录当前页面标注记录，再定义一个sendData对象来装载要发送给后台的数据。以下是这三个对象的结构：
```
sourceData:[
  {
    word:"标注的词"，
    id:"词的id（ci在数据库中的唯一标识）"，
    context:[
      "context1语境1",
      "context2语境2",
      "context3语境3",
    ]
  }
]

editData:[
  {
	id:标注词条id(int) 有的有有的没有
	word:标注的词条（string）
	type:标注类型(string)  name(人名)/organization(组织、机构名)/local(地方名)/entity(其他实体)/
	abbr(缩略语)/error(文本错误)/foreign(外来语)/plural(复数名词)/phrase(固定词组)/emphasis(表强调)/passive(动词被动式)/other(其他)
	annotator:标注者(string)
	note:其它时候的描述(string)/type不为其他的时候为空
	addition:人名地名缩略语等补充完整、文本错误补充正确拼写，可以为空(string)
	hyphen:true/false
  }
]

sendData:[
  {
	id:标注词条id(int) 有的有有的没有
	word:标注的词条（string）
	type:标注类型(string)  name(人名)/organization(组织、机构名)/local(地方名)/entity(其他实体)/
	abbr(缩略语)/error(文本错误)/foreign(外来语)/plural(复数名词)/phrase(固定词组)/emphasis(表强调)/passive(动词被动式)/other(其他)
	annotator:标注者(string)
	note:其它时候的描述(string)/type不为其他的时候为空
	addition:人名地名缩略语等补充完整、文本错误补充正确拼写，可以为空(string)
	hyphen:true/false
  }
]
```
2. 每次editData改变的时候（用户编辑标注），就会搜索一次sendData里面的数据，检索当前标注的词是否已经标注过，有就替换成当前标注的类型，没有就吧当前前数据的标注push进sendData里面。

![功能逻辑.png](http://upload-images.jianshu.io/upload_images/6455799-ce7f7770acd88d2c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3. 每次将sendData里面的数据发送到后台之后就会清空sendData里面的数据。
####更新记录
看来凡是个项目就避不开迭代...
- **1.1加一个顺便标注**
这个功能主要是想：当标注者在标注一个词时候，在语境中看到（确定）另一个和当前标注的词是同一个type和时候可以顺便给这个词进行标注。
解决方案：
  1. 加一个“顺便标注”的输入框，当用户在语境中发现一个想要顺便标注的词的时候可以复制粘贴在输入框内回车便可添加。也可以点击词上的小叉叉取消标注

![.gif](http://upload-images.jianshu.io/upload_images/6455799-79c06835bbb06c8a.gif?imageMogr2/auto-orient/strip)

  2. 当改变当前词的类型的时候，在sendData里面检索数据的时候会对顺便标注的词进行检索。
- **去掉“提交成功的搜索框”**
用户使用的时候反馈说，为了保险，所有人几乎都是标注一个就提交一次，每次提交都会alert“提交成功”，标注的效率太低，所以后来就取消了这个功能
-  **1.3给特定的标注类型添加补充**
当标注的type为“人名，地名，机构名”的时候可以补齐完整；当标注的“type”为缩略词的时候可以给出对应的完整词组；当为“文本错误时可以给出拼写正确的词”。
解决方案：
添加一个输入框进行编辑，当标注的type不为“人名，地名，机构名，缩略词，文本错误”时候，输入框为不可编辑状态。在editData和sendData中每个元素再添加一个addition的键对。

![6.gif](http://upload-images.jianshu.io/upload_images/6455799-8a2edf33caa553b4.gif?imageMogr2/auto-orient/strip)

- ##### 1.4用vue-cli重构代码**
由于原本代码写得就不规范，和项目结构的设计缺陷，使得第一版的代码可维护性非常的第，经过多次的更新，功能模块的添加，功能的更新之后，代码早就面目全非（不得不说每次加模块都异常辛苦），这个过程让我深刻深刻深刻地体会到了项目可维护性的重要性！再加上学了webpack和gulp，对vue-cli的认识也深刻了，所以决定用vue-cli来轻度重构一下代码。

![重构之前的目录结构](http://upload-images.jianshu.io/upload_images/6455799-6653157f69d65eda.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![vue--](http://upload-images.jianshu.io/upload_images/6455799-9f68d21d4fdb33e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#迭代2.0
###迭代的原因
当我用vue-cli来重构代码的时候，当时只是想着轻度重构，但是这个过程中发现了一下问题：
1. 代码中有严重的冗余，和大量不规范的代码
2. Vue中还使用了jq，依赖文件太重
3. 多次功能的更新，使得原本的逻辑已经不适用了。
4. 原本的添加补充的功能，并不能用在顺便标注的词上。
5. 界面不能适应移动端。

因为以上问题的存在，加上“多重构才是好码农”的信念，决定对标注系统来一次大规模重构，推出2.0.
###相对于1.0的改变

1.  添加移动端界面自适应

![8.gif](http://upload-images.jianshu.io/upload_images/6455799-0be924dec56b5ea7.gif?imageMogr2/auto-orient/strip)
2.  顺便标注的词也可以进行顺便标注

![9.gif](http://upload-images.jianshu.io/upload_images/6455799-4aa632cfe88bf5fa.gif?imageMogr2/auto-orient/strip)

3.  代码更加规范，可读性、可维护性更高
  - 参照vue风格指南重写了各个computed属性


![1.0时候的computed](http://upload-images.jianshu.io/upload_images/6455799-29018b4dfa25f369.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![2.0时候的computed](http://upload-images.jianshu.io/upload_images/6455799-8e32ac3c94dff45d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  - 懂得合理使用watch属性

![image.png](http://upload-images.jianshu.io/upload_images/6455799-33bbf87320d1df60.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  - 更合理和规范的注释
4. 舍弃原来的jq，增加了vue-resource库进行ajax交互，增加了vuex进行全局状态管理
5. 加一个“连字符不可去掉”的选线
添加一个“连字符不可去掉”的勾选框，这个属性可以为空。为了当出现“Chou En-lai”这种词时，En-lai这个是一个合法的词，帮助我们后面处理时，不会把这个破折号拿掉。

![10.gif](http://upload-images.jianshu.io/upload_images/6455799-9ed33f7414e7aa35.gif?imageMogr2/auto-orient/strip)


###实现逻辑上的改变
1. 改变了原来的editdata数据结构
```
1.0
editData:[
  {
	id:标注词条id(int) 有的有有的没有
	word:标注的词条（string）
	type:标注类型(string)  name(人名)/organization(组织、机构名)/local(地方名)/entity(其他实体)/
	abbr(缩略语)/error(文本错误)/foreign(外来语)/plural(复数名词)/phrase(固定词组)/emphasis(表强调)/passive(动词被动式)/other(其他)
	annotator:标注者(string)
	note:其它时候的描述(string)/type不为其他的时候为空
	addition:人名地名缩略语等补充完整、文本错误补充正确拼写，可以为空(string)
	hyphen:true/false
  }
]
2.0
editData:[
  [
      {
	  id:标注词条id(int) 有的有有的没有
	  word:标注的词条（string）
	  type:标注类型(string)  name(人名)/organization(组织、机构名)/local(地方名)/entity(其他实体)/
	  abbr(缩略语)/error(文本错误)/foreign(外来语)/plural(复数名词)/phrase(固定词组)/emphasis(表强调)/passive(动词被动式)/other(其他)
	  annotator:标注者(string)
	  note:其它时候的描述(string)/type不为其他的时候为空
	  addition:人名地名缩略语等补充完整、文本错误补充正确拼写，可以为空(string)
	  hyphen:true/false
      }
  ]
]
```
2. 布局上使用css3媒体查询实现自适应布局
使用媒体查询来监控设备屏幕的像素，实现自适应布局。
屏幕像素总共分为三个区间：0~649,650~859,大于860；
0~860区间卡元素宽度使用百分比。

![13.png](http://upload-images.jianshu.io/upload_images/6455799-d4c9a41dca7badf1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


作者水平有限，有错请各位大佬指出orz
